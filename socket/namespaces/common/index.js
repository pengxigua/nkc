/**
 * 通用消息连接
 */
const moment = require('moment');
const cookieConfig = require("../../../config/cookie");
const db = require('../../../dataModels');
const Cookies = require('cookies-string-parse');
const util = require('../../util');
const handles = require('./handles');
const {storeUser} = require('./store');
let io;
module.exports = async function(i){
  io = i;

  // 若系统意外停止运行则数据库中存在很多未被标记下线的用户
  // 启动时将所有人标记为下线
  await db.UserModel.updateMany({online: true}, {
    $set: {
      online: false,
      onlineType: ''
    }
  });

  let send = handles.makeSend(io);

  // 客户端连入
  io.on("connection", async socket => {
    await storeUser(socket);
    socket.sendMessage = send;
    socket.on("message", handles.message);
    socket.on("disconnect", handles.disconnect);
    socket.on('error', handles.error);
  });

  io.use(async (socket, next) => {
    // 从cookie中获取用户信息
    const {handshake, NKC} = socket;
    const {user} = NKC.data;
    if(!user) {
      return socket.disconnect(true);
    }
    // 获取该用户的房间中的全部连接id
    const clients = await util.getRoomClientsId(io, `user/${user.uid}`);
    // 每个用户最大连接数不能超过10
    // 若连接数超过10，则断开之前的连接建立新连接，保证连接数不超过10。
    if(clients.length >= 10) {
      let num = clients.length - 9;
      for(let i = 0; i < num; i++) {
        if(io.connected[clients[i]]) {
          io.connected[clients[i]].disconnect(true);
        }
      }
    }
    // 判断客户端平台
    let onlineType = handshake.query.os;
    if(!['phone', 'computer'].includes(onlineType)) {
      onlineType = 'computer';
    }
    socket.NKC.uid = user.uid;
    socket.NKC.onlineType = onlineType;
    await next();
  });

  io.on('connection', async (socket) => {
    const {uid, onlineType} = socket.NKC;
    // 上线 通知好友
    const friendsUid = await db.MessageModel.getUsersFriendsUid(uid);
    await  Promise.all(friendsUid.map(friendUid => {
      io.in(`user/${friendUid}`).emit('userConnect', {
        targetUid: uid,
        onlineType,
        platform: onlineType === 'phone'? 'app': 'web'
      })
    }));
    /*socket.join(`user/${uid}`, async () => {
      console.log(`${moment().format('YYYY/MM/DD HH:mm:ss').grey} ${(' '+global.NKC.processId + ' ').grey} ${' SOCKET '.bgGreen} ${uid.bgBlue} ${'/message1'.bgBlue} ${'连接成功'.bgGreen}`);
      global.NKC.io.of('/console').NKC.socketMessage('/message', true, uid);
    });*/
    await db.UserModel.updateOne({uid}, {
      $set: {
        online: true,
        onlineType
      }
    });
    socket.on('error', (err) => {
      console.log(err);
      disconnect(io, socket);
    });
    socket.on('disconnect', () => {
      disconnect(io, socket);
    });
  });

  // 暴露消息发送函数
  io.NKC = {...io.NKC, send, sendMessage}
};



async function sendMessage(channel, message) {
  try{
    message = JSON.parse(message);
    const _message = await db.MessageModel.extendMessage(undefined, message);
    message._message = _message;
    if(channel === 'withdrawn') {
      // 撤回信息
      const {r, s, _id} = message;
      io.to(`user/${r}`).to(`user/${s}`).emit('withdrawn', {
        uid: s,
        messageId: _id
      });
    } else if(channel === 'message') {
      const {ty, s, r} = message;
      if(ty === 'STE') {
        // 系统通知，通知给所有人
        io.emit('message', {
          message
        });
      } else if(ty === 'STU') {
        // 系统提醒，提醒某一个用户
        io.to(`user/${r}`).emit('message', {
          message
        });
      } else if(ty === 'UTU') {
        // 用户间的私信
        const sUser = await db.UserModel.findOne({uid: s});
        const rUser = await db.UserModel.findOne({uid: r});
        if(!sUser || !rUser) return;
        io.to(`user/${r}`).emit('message', {
          user: sUser,
          targetUser: rUser,
          myUid: r,
          message
        });
        message._message.position = 'right';
        io.to(`user/${s}`).emit('message', {
          user: sUser,
          targetUser: rUser,
          myUid: s,
          message
        });
      } else if(ty === 'friendsApplication') {
        // 好友申请
        const {respondentId, applicantId} = message;
        const respondent = await db.UserModel.findOne({uid: respondentId});
        const applicant = await db.UserModel.findOne({uid: applicantId});
        if(!respondent || !applicant) return;
        const data = {
          message: {
            ty: 'friendsApplication',
            _id: message._id,
            username: applicant.username,
            description: message.description,
            uid: applicant.uid,
            toc: message.toc,
            agree: message.agree
          }
        };
        io.to(`user/${respondentId}`).emit('message', data);
        if(message.c === 'agree') {
          io.to(`user/${applicantId}`).emit('message', data);
        }
      } else if(ty === 'deleteFriend') {
        // 删除好友
        const {deleterId, deletedId} = message;
        io.to(`user/${deleterId}`).to(`user/${deletedId}`).emit('message', {message});
      } else if(ty === 'modifyFriend') {
        // 修改好友设置
        const {friend} = message;
        io.to(`user/${friend.uid}`).emit('message', {message});
      } else if(ty === 'removeChat') {
        // 删除与好友的聊天
        const {deleterId} = message;
        io.to(`user/${deleterId}`).emit('message', {message});
      } else if(ty === 'markAsRead') {
        // 多终端同步信息，标记为已读
        const {uid} = message;
        io.to(`user/${uid}`).emit('message', {message});
      } else if(ty === 'editFriendCategory') {
        // 编辑好友分组
        const {uid} = message.category;
        io.to(`user/${uid}`).emit('message', {message});
      }
    }
  } catch(err) {
    console.log(err);
  }
}


// 出错或断开连接之后
async function disconnect(io, socket) {
  const {uid, address} = socket.NKC;
  if(!uid) return;
  const clients = await util.getRoomClientsId(io, `user/${uid}`);
  console.log(`${moment().format('YYYY/MM/DD HH:mm:ss').grey} ${(' '+global.NKC.processId + ' ').grey} ${' SOCKET '.bgGreen} ${uid.bgCyan} ${'/common'.bgBlue} ${'断开连接'.bgRed} ${address}`);
  global.NKC.io.of('/console').NKC.socketMessage('/common', false, uid);
  if(clients.length !== 0) return;
  await  db.UserModel.updateOne({uid}, {
    $set: {
      online: false
    }
  });
  const friendsUid = await db.MessageModel.getUsersFriendsUid(uid);
  await Promise.all(friendsUid.map(friendUid => {
    io.in(`user/${friendUid}`).emit('userDisconnect', {
      targetUid: uid,
      platform: 'outline'
    });
  }));
}

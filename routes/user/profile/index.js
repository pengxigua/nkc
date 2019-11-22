const Router = require('koa-router');
const router = new Router();
const thread = require("./thread");
const post = require("./post");
const draft = require("./draft");
const finance = require("./finance");
const subscribeUser = require("./subscribe/user");
const follower = require("./follower");
const subscribeTopic = require("./subscribe/topic");
const subscribeDiscipline = require("./subscribe/discipline");
const subscribeColumn = require("./subscribe/column");
const subscribeThread = require("./subscribe/thread");
const subscribeCollection = require("./subscribe/collection");
const summaryPie = require("./summary/pie");
const summaryCalendar = require("./summary/calendar");
router
  .use("/", async (ctx, next) => {
    const {db, data, params} = ctx;
    const {user, targetUser} = data;
    
    // 验证权限
    if(user.uid !== targetUser.uid && !ctx.permission("visitAllUserProfile")) {
      ctx.throw(403, "权限不足");
    }
    
    const {
      threadCount,
      postCount,
      draftCount
    } = targetUser;
    let url = ctx.url;
    url = url.replace(/\?.*/ig, "");
    url = url.replace(/\/u\/[0-9]+?\/profile\/*/ig, "");
    data.type = url;
    data.subUsersId = await db.SubscribeModel.getUserSubUsersId(targetUser.uid);
    data.subTopicsId = await db.SubscribeModel.getUserSubForumsId(targetUser.uid, "topic");
    data.subDisciplinesId = await db.SubscribeModel.getUserSubForumsId(targetUser.uid, "discipline");
    data.subForumsId = data.subTopicsId.concat(data.subDisciplinesId);
    data.subColumnsId = await db.SubscribeModel.getUserSubColumnsId(targetUser.uid);
    data.subThreadsId = await db.SubscribeModel.getUserSubThreadsId(targetUser.uid, "sub");
    data.fansId = await db.SubscribeModel.getUserFansId(targetUser.uid);
    data.collectionThreadsId = await db.SubscribeModel.getUserCollectionThreadsId(targetUser.uid);
    data.navLinks = [
      {
        name: "",
        links: [
          {
            type: "",
            url: `/u/${targetUser.uid}/profile`,
            name: "总览",
            count: 0
          }
        ]
      },
      {
        name: "我的发表",
        links: [
          {
            type: "thread",
            url: `/u/${targetUser.uid}/profile/thread`,
            name: "我的文章",
            count: threadCount
          },
          {
            type: "post",
            url: `/u/${targetUser.uid}/profile/post`,
            name: "我的回复",
            count: postCount
          },
          {
            type: "draft",
            url: `/u/${targetUser.uid}/profile/draft`,
            name: "我的草稿",
            count: draftCount
          }
        ]
      },
      {
        name: "我的关注",
        links: [
          {
            type: "subscribe/user",
            url: `/u/${targetUser.uid}/profile/subscribe/user`,
            name: "关注的用户",
            count: data.subUsersId.length
          },
          {
            type: "subscribe/topic",
            url: `/u/${targetUser.uid}/profile/subscribe/topic`,
            name: "关注的话题",
            count: data.subTopicsId.length
          },
          {
            type: "subscribe/discipline",
            url: `/u/${targetUser.uid}/profile/subscribe/discipline`,
            name: "关注的学科",
            count: data.subDisciplinesId.length
          },
          {
            type: "subscribe/column",
            name: "关注的专栏",
            url: `/u/${targetUser.uid}/profile/subscribe/column`,
            count: data.subColumnsId.length
          },
          {
            type: "subscribe/thread",
            url: `/u/${targetUser.uid}/profile/subscribe/thread`,
            name: "关注的文章",
            count: data.subThreadsId.length
          },
          {
            type: "subscribe/collection",
            url: `/u/${targetUser.uid}/profile/subscribe/collection`,
            name: "收藏的文章",
            count: data.collectionThreadsId.length
          }
        ]
      },
      {
        name: "？？？",
        links: [
          {
            type: "collection",
            url: `/u/${targetUser.uid}/profile/collection`,
            name: "回复过的文章",
            count: data.collectionThreadsId.length
          }
        ]
      },
      {
        name: "其他",
        links: [
          {
            type: "finance",
            url: `/u/${targetUser.uid}/profile/finance?t=all`,
            name: "我的账单",
            count: await db.KcbsRecordModel.count({
              $or: [
                {
                  from: targetUser.uid
                },
                {
                  to: targetUser.uid
                }
              ]
            })
          },
          {
            type: "follower",
            name: "我的粉丝",
            url: `/u/${targetUser.uid}/profile/follower`,
            count: data.fansId.length
          }
        ]
      }
    ];
    data.name = "";
    data.navLinks.map(nav => {
      nav.links.map(link => {
        if(data.type === link.type) data.name = link.name;
      })
    });
    ctx.template = "user/profile/profile.pug";
    await next();
  })
  .get("/", async (ctx, next) => {
    await next();
  })
  .use("/subscribe", async (ctx, next) => {
    const {query, data, db, state} = ctx;
    let {t} = query;
    const {targetUser} = data;
    data.subscribeTypes = await db.SubscribeTypeModel.getTypesTree(targetUser.uid);
    if(t) {
      data.t = Number(t);
      loop1:
      for(const s of data.subscribeTypes) {
        if(s._id === data.t) {
          data.parentType = s;
          data.childType = undefined;
          break;
        }
        for(const c of s.childTypes) {
          if(c._id === data.t) {
            data.parentType = s;
            data.childType = c;
            break loop1;
          }
        }
      }
    }
    state.match = {};
    if(data.childType) {
      state.match.cid = data.childType._id;
    } else if(data.parentType) {
      const childTypesId = data.parentType.childTypes.map(t => t._id);
      childTypesId.push(data.parentType._id);
      state.match.cid = {$in: childTypesId};
    }
    await next();
  })
  .get("/summary/pie", summaryPie)
  .get("/summary/calendar", summaryCalendar)
  .get("/subscribe/user", subscribeUser)
  .get("/subscribe/topic", subscribeTopic)
  .get("/subscribe/discipline", subscribeDiscipline)
  .get("/subscribe/column", subscribeColumn)
  .get("/subscribe/thread", subscribeThread)
  .get("/subscribe/collection", subscribeCollection)
  .get("/follower", follower)
  .get("/finance", finance)
  .get("/draft", draft)
  .get("/thread", thread)
  .get("/post", post);
module.exports = router;
const settings = require('../settings');
const moment = require('moment');
const cheerio = require('../nkcModules/nkcRender/customCheerio');
const mongoose = settings.database;
const Schema = mongoose.Schema;
const PATH = require('path');
const fsSync = require('../tools/fsSync');
const { existsSync, exists } = require('fs');
const fs = require("fs");
const fsPromise = fs.promises;
const resourceSchema = new Schema({
	rid: {
    type: String,
    unique: true,
    required: true
  },
  // 针对图片 原图ID
  originId: {
    type: String,
    default: ""
  },
  // md5
  hash: {
    type: String,
    default: "",
    index: 1
  },
  // 文件格式 小写字母
  ext: {
    type: String,
    default: ''
  },
  // 文件被下载次数
  hits: {
    type: Number,
    default: 0
  },
  // 上传时的文件名
  oname: {
    type: String,
    default: ''
  },
  // 文件路径
  path: {
    type: String,
    default: ''
    // required: true
  },
  // 文件大小
  size: {
    type: Number,
    default: 0
  },
  // 上传的时间
  toc: {
    type: Date,
    default: Date.now,
    index: 1
  },
  // 若附件已被上传过，通过此rid去找到附件的真实路径
  prid: {
    type: String,
    default: '',
    index: 1
  },
  // 文件路径（旧）
  tpath: {
    type: String,
    default: ''
  },
  // 上传者ID
  uid: {
    type: String,
    required: true,
    index: 1
  },
  // 文件类型 mediaPicture: 图片、mediaVideo：视频、mediaAudio：音频、mediaAttachment：附件
  mediaType: {
    type: String,
    index: 1,
    default: ''
  },
  // resource: 普通资源文件、sticker: 表情图片
  type: {
	  type: String,
    index: 1,
    default: "resource"
  },
  // pid、"fund_" + applicationForumId, 表示哪些post引用了该资源
  references: {
	  type: [String],
    index: 1,
    default: []
  },
  tlm: {
    type: Date,
    default: null,
    index: 1
  },
  // 为图片时 图片高度
  height: {
    type: Number,
    index: 1,
    default: null
  },
  // 为图片时 图片宽度
  width: {
    type: Number,
    index: 1,
    default: null
  },
  // usable: 正常, useless: 处理失败，不可用, inProcess: 处理中
  state: {
    type: String,
    index: 1,
    default: 'inProcess'
  }
},
{
  toObject: {
    getters: true,
    virtuals: true
  }
});


resourceSchema.virtual('isFileExist')
  .get(function() {
    return this._isFileExist;
  })
  .set(function(val) {
    return this._isFileExist = val
  });

resourceSchema.virtual('videoSize')
  .get(function() {
    return this._videoSize;
  })
  .set(function(val) {
    return this._videoSize = val
  });

/**
 * 文件是否存在
 */
resourceSchema.methods.setFileExist = async function(excludedMediaTypes = ['mediaPicture', 'mediaAudio']) {
  if(excludedMediaTypes.includes(this.mediaType)) return;
  const FILE = require('../nkcModules/file');
  if(this.mediaType === 'mediaVideo') {
    const sdVideoPath = await this.getFilePath('sd');
    const hdVideoPath = await this.getFilePath('hd');
    const fhdVideoPath = await this.getFilePath('fhd');
    const videoSize = [];
    if(await FILE.access(sdVideoPath)) videoSize.push('sd');
    if(await FILE.access(hdVideoPath)) videoSize.push('hd');
    if(await FILE.access(fhdVideoPath)) videoSize.push('fhd');
    this.isFileExist = videoSize.length !== 0;
    this.videoSize = videoSize;
  } else {
    const path = await this.getFilePath();
    this.isFileExist = await FILE.access(path);
  }
}

/*
  获取文件路径
*/
resourceSchema.methods.getFilePath = async function(size) {
  const videoSize = require('../settings/video');
  const FILE = require('../nkcModules/file');
  const ResourceModel = mongoose.model('resources');
  const {toc, ext, rid, prid} = this;
  if(prid) {
    const parentResource = await ResourceModel.findOne({rid: prid});
    if(!parentResource) throwErr(500, `附件丢失 rid:${prid}`);
    return await parentResource.getFilePath(size);
  }
  const fileFolder = await ResourceModel.getMediaPath(this.mediaType, toc);
  let filePath;
  if(this.mediaType === 'mediaVideo') {
    if(!Object.keys(videoSize).includes(size)) {
      filePath = `./${rid}_sd.${ext}`;
      for(const s of Object.keys(videoSize)) {
        const _filePath = `./${rid}_${s}.${ext}`;
        const targetPath = PATH.resolve(fileFolder, _filePath)
        if(!await FILE.access(targetPath)) continue;
        filePath = _filePath;
        break;
      }
    } else {
      filePath = `./${rid}_${size}.${ext}`;
    }
  } else {
    filePath = `./${rid}.${ext}`;
  }
  return PATH.resolve(fileFolder, filePath);
};
/*
*  获取PDF预览文件
* */
resourceSchema.methods.getPDFPreviewFilePath = async function() {
  const ResourceModel = mongoose.model('resources');
  const {toc, ext, rid, prid} = this;
  if(prid) {
    const parentResource = await ResourceModel.findOne({rid: prid});
    if(!parentResource) throwErr(500, `附件丢失 rid:${prid}`);
    return await parentResource.getPDFPreviewFilePath();
  }
  const fileFolder = await ResourceModel.getMediaPath(this.mediaType, toc);
  return PATH.resolve(fileFolder, `./${rid}_preview.${ext}`);
};

// 检测html内容中的资源并将指定id存入resource.reference
resourceSchema.statics.toReferenceSource = async function(id, declare) {
  const model = mongoose.model("resources");
	const $ = cheerio.load(declare);
  const resourcesId = [];
  $(`[data-tag="nkcsource"]`).each((index, el) => {
    el = $(el);
    const {type, id} = el.data();
    if(!["picture", "video", "audio", "attachment"].includes(type)) return;
    resourcesId.push(id);
  });
  await model.updateMany({
    rid: {$in: resourcesId}
  }, {
    $addToSet: {
      references: id
    }
  });
};


/*
* 查找一个post引用的所有source
* @param {String | [String]} 引用者ID字符串或ID字符串数组
* */
resourceSchema.statics.getResourcesByReference = async function(id) {
  const ResourceModel = mongoose.model("resources");
  if(!Array.isArray(id)) {
    id = [id];
  }
  const resources = await ResourceModel.find({references: {$in: id}});
  for(let resource of resources) {
    await resource.setFileExist();
  }
  return resources;
};

/*
* 检查用户是否有权限上传当前文件
* @param {Object} user 用户对象
* @param {File} file 文件对象
* */
resourceSchema.statics.checkUploadPermission = async (user, file) => {
  const SettingModel = mongoose.model("settings");
  const ResourceModel = mongoose.model("resources");
  const {getSize} = require("../nkcModules/tools");
  const {getFileExtension} = require("../nkcModules/file");
  const uploadSettings = await SettingModel.getSettings('upload');
  const {countLimit, sizeLimit, extensionLimit} = uploadSettings;
  let {size, ext} = file;
  if(!ext) ext = await getFileExtension(file);
  // 检查文件大小是否符合要求
  let settingSize;
  for(const s of sizeLimit.others) {
    if(s.ext === ext) {
      settingSize = s.size;
      break;
    }
  }
  if(settingSize === undefined) {
    settingSize = sizeLimit.default;
  }
  if(size <= settingSize * 1024) {}
  else {
    throwErr(400, `${ext}文件不能超过${getSize(settingSize * 1024, 1)}`);
  }

  if(!user.grade) await user.extendGrade();
  if(!user.roles) await user.extendRoles();

  // 检查用户当前上传的文件总数是否达到极限
  const today = require("../nkcModules/apiFunction").today();
  const uploadedCount = await ResourceModel.countDocuments({uid: user.uid, toc: {$gte: today}});
  const certList = [];
  certList.push(`grade-${user.grade._id}`);
  user.roles.map(role => {
    certList.push(`role-${role._id}`);
  });
  let settingCount = undefined;
  for(const cl of countLimit.others) {
    if(certList.includes(cl.type)) {
      if(settingCount === undefined || settingCount < cl.count) {
        settingCount = cl.count;
      }
    }
  }
  if(settingCount === undefined) {
    settingCount = countLimit.default;
  }
  if(uploadedCount >= settingCount) throwErr(400, '今日上传文件数量已达上限');

  // 检查文件格式黑白名单
  let blacklistArr = undefined, whitelistArr = undefined;
  for(const el of extensionLimit.others) {
    if(certList.includes(el.type)) {
      const {blacklist, whitelist, using} = el;
      if(using === 'blacklist') {
        if(!blacklistArr) blacklistArr = [];
        blacklistArr = blacklistArr.concat(blacklist);
      } else if(using === 'whitelist') {
        if(!whitelistArr) whitelistArr = [];
        whitelistArr = whitelistArr.concat(whitelist);
      } else {
        throwErr(500, `后台上传配置错误，using: ${using}`);
      }
    }
  }
  // 如果用户没有后台配置的证书或等级，则黑白名单取默认值
  if(blacklistArr === undefined && whitelistArr === undefined) {
    const {defaultBlacklist, defaultWhitelist, using} = extensionLimit;
    if(using === 'blacklist') {
      blacklistArr = [].concat(defaultBlacklist);
    } else if(using === 'whitelist') {
      whitelistArr = [].concat(defaultWhitelist);
    } else {
      throwErr(500, `后台上传配置错误，using: ${using}`);
    }
  }
  if(blacklistArr === undefined) {
    // 仅存白名单
    if(!whitelistArr.includes(ext)) throwErr(400, '文件格式不被允许');
  } else if(whitelistArr === undefined) {
    // 仅存黑名单
    if(blacklistArr.includes(ext)) throwErr(400, '文件格式不被允许');
  } else {
    // 黑白名单均有
    // 去除同时存在于黑名单和白名单的文件格式
    blacklistArr = blacklistArr.filter(b => !whitelistArr.includes(b));
    if(blacklistArr.includes(ext)) throwErr(400, '文件格式不被允许');
  }
};

/*
* 获取附件文件夹路径，不包含文件
* @param {String} type mediaAttachment: 附件, mediaPicture: 图片, mediaVideo: 视频, mediaAudio: 音频
* @param {Date} t 基础时间，用于查找资源文件夹
* @return {String} 文件夹路径
* @author pengxiguaa 2020/6/17
* */
resourceSchema.statics.getMediaPath = async (type, t) => {
  const file = require("../nkcModules/file");
  return await file.getPath(type, t);
};

/*
* 清除附件上传状态
* @author pengxiguaa 2020/8/19
* */
resourceSchema.statics.clearResourceState = async () => {
  const ResourceModel = mongoose.model('resources');
  const time = Date.now() - 2*60*60*1000;
  await ResourceModel.updateMany({
    toc: {$lte: time},
    state: 'inProcess'
  }, {
    $set: {
      state: 'useless'
    }
  });
}

/*
* 文件下载 时段、文件个数判断
* @param {Object} user 用户对象
* @param {String} ip 访问者的ip地址
* @author pengxiguaa 2020-10-11
* */
resourceSchema.methods.checkDownloadPermission = async function(user, ip) {
  const SettingModel = mongoose.model('settings');
  const DownloadLogModel = mongoose.model('downloadLogs');
  const apiFunction = require('../nkcModules/apiFunction');
  const downloadOptions = await SettingModel.getDownloadSettingsByUser(user);
  const {freeTime} = await SettingModel.getSettings('download');
  const {fileCountLimit} = downloadOptions;
  const {fileCount, startingTime, endTime} = fileCountLimit;
  if(fileCount === 0) {
    if(!user) {
      throwErr(403, `只有登录用户可以下载附件，请先登录或注册。`);
    } else {
      throwErr(403, `当前时段（${startingTime}点 - ${endTime}点）暂不允许下载附件，请下一个时段再试。`);
    }
  }
  let downloadLogs;
  const today = apiFunction.today().getTime();
  const now = new Date();
  const hour = now.getHours();
  let match;
  if(startingTime < endTime) {
    match = {
      toc: {
        $gte: new Date(today + startingTime * 60 * 60 * 1000),
        $lt: new Date(today + endTime * 60 * 60 * 1000)
      }
    };
  } else {
    if(hour >= startingTime) {
      match = {
        toc: {
          $gte: new Date(today + startingTime * 60 * 60 * 1000),
          $lt: now
        }
      }
    } else {
      match = {
        toc: {
          $gte: new Date(today + (startingTime - 24) * 60 * 60 * 1000),
          $lt: now
        }
      }
    }
  }
  const matchToday = {
    toc: {
      $gte: Date.now() - freeTime * 60 * 60 * 1000
    },
    rid: this.rid
  };
  if(!user) {
    match.ip = ip;
    match.uid = '';
    matchToday.ip = ip;
    matchToday.uid = ''
  } else {
    match.uid = user.uid;
    matchToday.uid = user.uid;
  }
  // 判断24小时以内是否下载过
  const downloadToday = await DownloadLogModel.findOne(matchToday);
  if(!downloadToday) {
    // 判断当前时段附件下载数量是否超过限制
    const logs = await DownloadLogModel.aggregate([
      {
        $match: match
      },
      {
        $group: {
          _id: '$rid',
          count: {
            $sum: 1
          }
        }
      }
    ]);
    downloadLogs = logs? logs.map(l => l._id): [];
    if(downloadLogs.length >= fileCount) {
      if(user) {
        throwErr(403, `当前时段（${startingTime}点 - ${endTime}点）下载的附件数量已达上限，请在下一个时段再试。`);
      } else {
        throwErr(403, `未登录用户当前时段（${startingTime}点 - ${endTime}点）只能下载${fileCount}个附件，请登录或注册后重试。`);
      }
    }
  }
};

/*
* 判断用户下载此附件是否需要积分
* @param {Object} user 用户对象
* @return {Object} 是否需要积分
*   @param {Boolean} needScore 是否需要积分
*   @param {String} reason 原因 setting: 因为后台设置，repeat: 重复下载
*   @param {String} description 具体说明
* @author pengxiguaa 2020-10-15
* */
resourceSchema.methods.checkDownloadCost = async function(user) {
  const SettingModel = mongoose.model("settings");
  const ScoreOperationModel = mongoose.model('scoreOperations');
  const ScoreOperationLogModel = mongoose.model('scoreOperationLogs');
  const downloadSettings = await SettingModel.getSettings('download');
  const {freeTime} = downloadSettings;
  let needScore = false;
  // 获取下载附件时的积分设置
  const operation = await ScoreOperationModel.getScoreOperationFromRedis(
    "default", "attachmentDownload"
  );
  if(operation.count === 0) {
    return {
      needScore: false,
      reason: 'setting',
      description: ''
    };
  }
  // 获取已开启的积分
  const enabledScoreTypes = await SettingModel.getEnabledScoresType();
  for(const typeName of enabledScoreTypes) {
    const number = operation[typeName];
    if(number !== 0) {
      needScore = true;
      break;
    }
  }
  if(needScore === false) {
    return {
      needScore: false,
      reason: 'setting',
      description: ''
    };
  }
  if(!user) {
    throwErr(403, `你暂未登录，请登录或注册后重试。`);
  }
  const todayOperationCount = await ScoreOperationLogModel.getOperationLogCount(user, 'attachmentDownload');
  const lastAttachmentDownloadLog = await ScoreOperationLogModel.getLastAttachmentDownloadLog(user, this.rid);
  const nowTime = new Date();
  let description = '';
  if(lastAttachmentDownloadLog) {
    const lastAttachmentDownloadTime = lastAttachmentDownloadLog.toc;
    const timeout = nowTime - lastAttachmentDownloadTime - freeTime * 60 * 60 * 1000;
    if(timeout <= 0) {
      // 下载时间未超过24小时 不收费
      return {
        needScore: false,
        reason: 'repeat',
        description: `${freeTime}小时以内重复下载免费。`
      };
    } else {
      description = `您曾于${moment(lastAttachmentDownloadTime).format("YYYY年MM月DD日")}下载该附件，现已超过${(Math.ceil(timeout / (60 * 60 * 1000)))}小时，再次下载将花费积分。`;
    }
  }
  if(
    todayOperationCount >= operation.count &&
    operation.count !== -1 && operation.count !== 0
  ) {
    // 下载的次数超过设置的值后不收费
    return {
      needScore: false,
      reason: 'setting',
      description: ``
    };
  } else {
    return {
      needScore: true,
      reason: 'setting',
      description
    };
  }
};


/*
* 判断用户下载所需的积分是否足够
* @param {Object} user 用户对象
* @return {Object}  用户积分是否足够
*   @param {Boolean} enough 是否足够
*   @param {[Object]} userScores 用户积分相关
* @author pengxiguaa 2020-10-15
* */
resourceSchema.methods.checkUserScore = async function(user) {
  const UserModel = mongoose.model('users');
  const ScoreOperationModel = mongoose.model('scoreOperations');
  await UserModel.updateUserScores(user.uid);
  const userScores = await UserModel.getUserScores(user.uid);
  const operation = await ScoreOperationModel.getScoreOperationFromRedis(
    "default", "attachmentDownload"
  );
  let enough = true;
  for(const score of userScores) {
    const operationScoreNumber = operation[score.type];
    score.addNumber = operationScoreNumber;
    // 下载给积分，用户积分肯定是足够的
    if(operationScoreNumber >= 0) continue;
    // 下载扣积分
    if((score.number + operationScoreNumber) < 0) {
      enough = false;
    }
  }
  return {
    enough,
    userScores: userScores
  };
};

module.exports = mongoose.model('resources', resourceSchema);

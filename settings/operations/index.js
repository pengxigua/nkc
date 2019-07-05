// 通过url和请求方法确定操作类型
// PARAMETER代表url中不确定的值，如 '/u/uid/settings/info' 中的uid是个变化的值
const resourceObj = require('./resource');
const {
	avatar,
	shopLogo,
	poster,
	avatar_small,
	forum_avatar,
	r,
	rt,
	rm,
	ro,
	cover,
	frameImg,
	appDownload,
	resources,
	pfa,
	pfb,
	fundLogo,
	fundBanner,
	photo,
	photo_small,
	logo,
} = resourceObj;

const auth = require('./auth');
const editor = require('./editor');
const exam = require('./exam');
const e = require('./experimental');
const f = require('./forum');
const fund = require('./fund');
const login = require('./login');
const logout = require('./logout');
const me = require('./me');
const column = require('./column');
const m = require('./columns');
const p = require('./post');
const problem = require('./problem');
const register = require('./register');
const search = require('./search');
const sendMessage = require('./sendMessage');
const sms = require('./sms');
const t = require('./thread');
const u = require('./user');
const page = require('./page');
const download = require('./download');
const forgotPassword = require('./forgotPassword');
const app = require('./app');
const message = require('./message');
const activity = require('./activity');
const s = require('./share');
const friend = require('./friend');
const friend_category = require('./friendCatagory');
const subscription = require('./homeSubscription');
const lottery = require('./lottery');
const shop = require('./shop');
const account = require('./account');
const complaint = require("./complaint");
const imageEdit = require('./imageEdit');
const protocol = require('./protocol');
const review = require("./review");
const operationObj = {};


// 默认操作类型，没有路由与之对应的操作权限
operationObj.defaultOperations = [
	'modifyOtherPosts',
	'displayRecycleMarkThreads',
	'displayDisabledPosts',
	'displayPostHideHistories',
	'displayFundNoVerifyBills',
	'displayFundBillsSecretInfo',
	'displayFundApplicationFormSecretInfo',
	'getAnyBodyPhoto',// 忽略相册、证书照片的权限
	'removeAnyBodyPhoto',// 忽略相册、证书照片的权限
  'canSendToEveryOne', // 跳过`仅接收好友信息`限制
  'creditXsf',
  'modifyAllQuestions', // 可修改审核过的试题
  'viewAllPaperRecords', // 可查看所有的考试记录
  'removeAllQuestion', // 可删除别人出的试题
  'superModerator', // 超级专家，所有专业的专家权限
  "getAnyBodyShopCert", // 可查看任何人的商城凭证
  "viewUserAllFansAndFollowers" // 可查看用户的所有关注的人和粉丝
];


operationObj.operationTree = {
	home: {
		GET: 'visitHome',// 首页

		logo, // 网站logo

		poster, //活动海报
		avatar,// 用户头像
		avatar_small,
		shopLogo, //店铺logo

		forum_avatar,// 专业logo

		r,// 资源
		rt, // 小号图 150
		rm, // 中号图 640
		ro, // 原图 3840

		default: resourceObj.default,
		attachIcon: resourceObj.attachIcon,

		cover,// 文章封面

		frameImg,// 视频封面

		appDownload,

		resources,// 网站logo

		pfa,// 专栏logo

		pfb,// 专栏banner

		fundLogo,// 基金项目logo

		fundBanner,// 基金项目banner

		photo,// 照片
		photo_small,

		auth,// 身份认证审核

		editor,// 编辑器

		exam,// 考试

		e,// 管理

		f,//专业

		fund,// 基金

		login,// 登录

		logout,// 退出登录

		me,// 自己

		m,// 专栏

		p,// 回复

		problem,// 报告问题

		register,// 注册

		search,// 搜索

		sendMessage,// 短信

		sms,// 发信息

		t,// 文章

		u,// 用户

		download, // 编辑器自动上传图片

		forgotPassword,

		page,

		app,// 手机app

		activity, //活动

		s, // 分享

		message, // 信息（新）

    friend, // 好友


    friend_category, // 好友分组

    subscription, // 首页我的关注

		lottery, // 抽奖页

		shop, //商城
		
		imageEdit, // 编辑图片

		protocol, // 论坛协议
    
    account, // 个人中心

    complaint, // 用户投诉

    review, // 审核

    column, // 专栏申请
	}
};
module.exports = operationObj;
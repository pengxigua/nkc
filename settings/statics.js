const path = require('path');
const defaultPath = path.resolve('resources/default_things');
const watermark = path.resolve('resources/default_things/default_watermark3.png');
const fontTtf = path.resolve('resources/default_things/simsun.ttc');
const banner = path.resolve('resources/site_specific/ad_default.jpg');
const defaultPfBannerPath = defaultPath + '/default_pf_banner.jpg';
const defaultPfAvatarPath = defaultPath + '/default_pf_avatar.jpg';
const defaultAvatarPath = defaultPath + '/default_avatar.gif';
const defaultAvatarSmallPath = defaultPath + '/default_avatar_small.gif';
const defaultThumbnailPath = defaultPath + '/default_thumbnail.png';
const siteSpecificPath = path.resolve('resources/site_specific');
const defaultAdPath = siteSpecificPath + '/ad_default.jpg';
const defaultImageResourcePath = defaultPath + '/default_resource_image.jpg';
const defaultUserBannerPath = defaultPath + '/default_user_banner.jpg';
const defaultMessageFilePath = defaultPath + '/default_resource_image.jpg';
module.exports = {
	siteSpecificPath,
  watermark,
  banner,
  fontTtf,
  defaultPfBannerPath,
  defaultPfAvatarPath,
  defaultAvatarPath,
  defaultAvatarSmallPath,
  defaultThumbnailPath,
	defaultUserBannerPath,
	defaultPath,
  defaultAdPath,
  defaultImageResourcePath,
  defaultMessageFilePath
};
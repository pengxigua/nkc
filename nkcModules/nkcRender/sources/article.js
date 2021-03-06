const {getUrl, getSize} = require("../../tools");
const cheerio = require("../customCheerio");
const {htmlEscape} = require("../htmlEscape");
const videoSize = require('../../../settings/video');
module.exports = {
  picture(html = "", id, resource = {}) {
    const {
      width, height,
      oname = "未知",
      rid = id
    } = resource || {};
    const url = getUrl("resource", rid);
    if(!width || !height) {
      return `
        <span data-tag="nkcsource" data-type="picture" data-id="${id}">
          <img src="${url}" alt="${oname}" data-type="view" dataimg="content">
        </span>
      `.trim();
    } else {
      return `
        <span data-tag="nkcsource" data-type="picture" data-id="${id}" style="width: ${width}px;">
          <span style="padding-top: ${(height * 100) / width}%">
            <img data-src="${url}" alt="${oname}" data-type="view" dataimg="content" class="lazyload">
          </span>
        </span>
      `.trim();
    }
  },
  sticker(html, id) {
    const url = getUrl("sticker", id);
    return `
      <span data-tag="nkcsource" data-type="sticker" data-id="${id}">
        <img src="${url}" alt="sticker">
      </span>
    `.trim();
  },
  video(html = "", id, resource = {}) {
    const {
      oname = "未知",
      rid = id
    } = resource;
    const poster = getUrl("videoCover", rid);
    if(resource.isFileExist) {
      let sourceHtml = '';
      for(const s of resource.videoSize) {
        const {height} = videoSize[s];
        const url = getUrl('resource', rid, s);
        sourceHtml += `<source src="${url}" type="video/mp4" size="${height}"> 你的浏览器不支持video标签，请升级。`;
      }
      return `
      <span data-tag="nkcsource" data-type="video" data-id="${id}">
        <video class="plyr-dom" preload="none" controls="controls" poster="${poster}" data-rid="${rid}" data-plyr-title="${oname}">
          ${sourceHtml}
        </video>
        <span class="nkcsource-video-title">${resource.oname} <span class="display-i-b text-danger" style="font-weight: 700">${getSize(resource.size)}</span></span>
      </span>
    `.trim();
    } else {
      return `<span data-tag="nkcsource" data-type="video-not-found"><span>视频已丢失（${oname}）</span></span>`
    }

    //<span class="nkcsource-video-title">${resource.oname}</span>
  },
  audio(html = "", id, resource = {}) {
    const url = getUrl("resource", id);
    return `
      <span data-tag="nkcsource" data-type="audio" data-id="${id}">
        <audio class="plyr-dom" preload="none" controls data-rid="${id}" data-size="${resource.size}">
          <source src="${url}" type="audio/mp3"/>
          你的浏览器不支持audio标签，请升级。
        </audio>
        <span class="nkcsource-audio-title">${resource.oname} <span class="display-i-b text-danger" style="font-weight: 700">${getSize(resource.size)}</span></span>
      </span>
    `.trim();
  },
  attachment(html = "", id, resource = {}) {
    const {
      oname = "未知",
      size = 0,
      ext = "",
      hits = 0,
      rid = id,
    } = resource;
    const fileCover = getUrl("fileCover", ext);
    let url = getUrl("resource", rid);
    let pdfHTML = "";
    if(ext === "pdf") {
      const pdfUrl = getUrl("pdf", rid);
      pdfHTML = `
        <span class="article-attachment-reader">
          <a href="/reader/pdf/web/viewer?file=%2fr%2f${rid}" target="_blank">预览</a>
          <span class="fa fa-question-circle" title="预览文件已被压缩处理，并不代表真实文件质量"></span>
        </span>
      `.trim();
    }
    return `
      <span data-tag="nkcsource" data-type="attachment" data-id="${id}">
        <span class="article-attachment-icon">
          <img src="${fileCover}" alt="attachment icon">
        </span>
        <span class="article-attachment-content">
          ${resource.isFileExist? `<span class="article-attachment-name" title="${oname}" data-type="clickAttachmentTitle" data-id="${id}">${oname}</span>`:
            `<span class="article-attachment-name" title="${oname}" title="${oname}（附件已丢失）">${oname}</span>`}
          <span class="article-attachment-info">
            <span class="article-attachment-size">${getSize(size)}</span>
            <span class="article-attachment-ext">${ext.toUpperCase()}</span>
            <span class="article-attachment-hits">${hits}次下载</span>
            ${resource.isFileExist?pdfHTML:`<span class="article-attachment-ext">附件已丢失</span>`}
          </span>
        </span>
      </span>  
    `.trim();
  },
  pre(html) {
    return html.replace(/<pre(.*?)>([\s\S]*?)<\/pre>/ig, (content, v1, v2) => {
      // v2 = htmlEscape(v2);
      return `<pre${v1}>${v2}</pre>`;
    });
  },
  xsf(html, id, r, user = {}) {
    const {xsf = 0} = user;
    const $ = cheerio.load(html);
    let content;
    if(Number(id) <= xsf) {
      content = $("section").html();
    } else {
      content = "内容已隐藏";
    }
    return `<span data-tag="nkcsource" data-type="xsf" data-id="${id}"><span>浏览这段内容需要${id}学术分</span><span>${content}</span></span>`;
  },
};

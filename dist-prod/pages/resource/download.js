!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";var e=!1;window.payForDownloadResource=function(t){var o=document.createElement("a");e?o.href="/r/".concat(t,"?d=attachment&random=").concat(Math.random()):(o.href="/r/".concat(t,"?c=download&random=").concat(Math.random()),o.setAttributeNode(document.createAttribute("download")),e=!0),o.click(),$(".resource-scores").remove(),$(".error-code").remove(),$(".resource-downloaded-tip").show(),$(".download-button").text("重新下载")},window.previewPDFResource=function(t){var o=document.createElement("a");e?(o.href=NKC.methods.tools.getUrl("pdf",t),o.setAttribute("target","_blank"),o.click()):(o.href="/r/".concat(t,"?c=preview_pdf&random=").concat(Math.random()),o.setAttribute("target","_blank"),o.click(),e=!0)},window.closePage=function(){"reactNative"===NKC.configs.platform?NKC.methods.appClosePage():window.close()}}));
!function(n){"function"==typeof define&&define.amd?define(n):n()}((function(){"use strict";function n(){return(n=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&(n[t]=i[t])}return n}).apply(this,arguments)}function e(){window.hasImg=!0,window.positionObj=void 0}function i(n){var i='<img src="'+n+'" style="width: 100px;height:100px" id="element_id">';$(".user-settings-img-dev").html(i),e()}window.positionObj=void 0,window.hasImg=!1,window.upLoadFile=void 0,$(document).ready((function(){$("#dealDescription").on("input propertychange",(function(){$("#dealDescriptionNum").text($("#dealDescription").val().length)})),$("#dealAnnouncement").on("input propertychange",(function(){$("#dealAnnouncementNum").text($("#dealAnnouncement").val().length)}))})),$("#inputFile").on("change",(function(){var n=$("#inputFile")[0].files[0];n&&(window.upLoadFile=n);var e=new FileReader;e.onload=function(){i(e.result)},e.readAsDataURL(upLoadFile)})),n(window,{init:e,displayAvatar:i,submit:function(n){if(!hasImg)return screenTopWarning("请选择图片");var e=new FormData;e.append("file",upLoadFile),$.ajax({url:"/shopLogo/"+n,method:"POST",cache:!1,data:e,headers:{FROM:"nkcAPI"},dataType:"json",contentType:!1,processData:!1}).done((function(){screenTopAlert("保存成功")})).fail((function(n){screenTopWarning(JSON.parse(n.responseText).error)}))},saveToInfo:function(n){var e=$("#dealDescription").val().trim(),i=$("#dealAnnouncement").val().trim(),t=$("#location").val().trim(),o=$("#address").val().trim();t&&o?i.length>500?screenTopWarning("全局公告不得超过500字"):e.length>200?screenTopWarning("供货说明不得超过200字"):(o=t+"&"+o,nkcAPI("/shop/manage/"+n+"/info","POST",{dealDescription:e,address:o,dealAnnouncement:i}).then((function(n){screenTopAlert("交易基础设置保存成功")})).catch((function(n){screenTopWarning(n||n.error)}))):screenTopWarning("地区、地址都是必填项")}})}));
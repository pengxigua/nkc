!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var o=arguments[n];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a])}return e}).apply(this,arguments)}var n=!1;function o(e){var o='<img src="'+e+'" style="width: 100%;height:180px">';$("#imgDom").html(o),n=!0}window.upLoadFile=void 0,$("#imageUpload").on("change",(function(){var e=$("#imageUpload")[0].files[0];e&&(window.upLoadFile=e);var n=new FileReader;n.onload=function(){o(n.result)},n.readAsDataURL(upLoadFile)})),e(window,{displayAvatar:o,submit:function(){if(!n)return screenTopWarning("请选择图片");var e=new FormData,o=$("#carouselLink").val();if(!o)return screenTopWarning("请填写轮播图指向url");e.append("file",upLoadFile),e.append("targetUrl",o),$.ajax({url:"/e/settings/shop/homeSetting/carousel",method:"POST",cache:!1,data:e,headers:{FROM:"nkcAPI"},dataType:"json",contentType:!1,processData:!1}).done((function(){screenTopAlert("保存成功"),window.location.reload()})).fail((function(e){screenTopWarning(JSON.parse(e.responseText).error)}))},delCarousel:function(e){nkcAPI("/e/settings/shop/homeSetting/carousel","PUT",{index:e}).then((function(e){screenTopAlert("删除成功"),window.location.reload()})).catch((function(e){screenTopWarning(e|e.error)}))}})}));
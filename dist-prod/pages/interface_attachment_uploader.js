!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e}).apply(this,arguments)}window.extension=void 0;var n=function(e){var n={};n.files_left=0;var t=function(n){return console.log("create upload start"),new Promise((function(t,o){!function(n,t,o){var a=new XMLHttpRequest;a.upload.onprogress=function(n){var t=n.loaded/n.total*100;console.log("Uploaded "+t+"%"),e.percentage_callback(t),100==t&&[".mov",".mp4"].indexOf(extension.toLowerCase())>-1&&e.video_on_turn("on")},a.onreadystatechange=function(){4==a.readyState&&(a.status>=200&&a.status<300?([".mov",".mp4"].indexOf(extension.toLowerCase())>-1&&e.video_on_turn("down"),o(null,a.responseText)):([".mov",".mp4"].indexOf(extension.toLowerCase())>-1&&e.video_on_turn("fail"),o(a.status.toString()+" "+a.responseText)))},a.open("POST",n.toString().toLowerCase(),!0),a.setRequestHeader("FROM","nkcAPI"),a.send(t)}(e.upload_target,n,(function(n,a){console.log("post upload called back"),n?(e.upload_failed_callback(n),o(n)):(e.upload_success_callback(a),t(a))}))}))};function o(o){return console.log("ulof"),common.mapWithPromise(o,(function(o){if(o&&o.size){var a=new FormData;a.append("file",o);var i=o.name.lastIndexOf("."),l=o.name.length;return window.extension=o.name.substring(i,l),console.log(o),t(a).catch((function(e){console.log(e)})).then((function(){n.files_left-=1,e.files_left_callback(n.files_left)}))}}))}return n.uploadfile_click=function(){var t=geid("file-selector").files;if(0==t.length)return alert("至少选一个呗");if(t.length>50)return alert("一次不要上传超过10个文件");for(i=0;i<t.length;i++)n.files_left+=1,e.files_left_callback(n.files_left);o(t).then((function(){geid("file-selector").value=""}))},n.paste_handler=function(e){var n=e.clipboardData.items;if(n.length>4)return alert("一次不要那么多文件,暂时先这样");for(i in n)if(console.log("Item: "+n[i].type),n[i].type){var o=new FormData;o.append("file",n[i].getAsFile()),t(o)}else console.log("Discarding paste data: "+n[i].type)},n},t=n({upload_target:ga("file-uploading","target"),upload_success_callback:function(e){list&&list.refresh()},upload_failed_callback:function(e){alert("上传失败，请重新上传")},files_left_callback:function(e){geid("upload-counter").innerHTML=e>0?e.toString()+" file(s) left...":"no files uploading."},percentage_callback:function(e){geid("upload-percentage").innerHTML=e.toFixed()+"%"},video_on_turn:function(e){"on"==e?geid("upload-video").innerHTML="视频正在转码":"down"==e?geid("upload-video").innerHTML="视频转码完成":"fail"==e&&(geid("upload-video").innerHTML="视频转码失败，请重新上传")}});geid("paste-target").addEventListener("paste",t.paste_handler),geid("upload-button").addEventListener("click",t.uploadfile_click),e(window,{attachment_uploader:n,uploader:t})}));
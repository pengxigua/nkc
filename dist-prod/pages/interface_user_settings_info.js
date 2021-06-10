!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}window.selectImage=void 0,$((function(){NKC.methods.selectImage&&(window.selectImage=new NKC.methods.selectImage)}));var t=NKC.methods.getDataById("data"),n=new Vue({el:"#app",data:{usernameSettings:t.usernameSettings,user:t.user,modifyUsernameCount:t.modifyUsernameCount,newUsername:"",usernameScore:t.usernameScore},computed:{needScore:function(){if(this.usernameSettings.free)return 0;if(this.modifyUsernameCount<this.usernameSettings.freeCount)return 0;var e=this.modifyUsernameCount+1-this.usernameSettings.freeCount;return e*this.usernameSettings.onceKcb<this.usernameSettings.maxKcb?e*this.usernameSettings.onceKcb:this.usernameSettings.maxKcb}},methods:{saveNewUsername:function(){nkcAPI("/u/"+this.user.uid+"/settings/username","PUT",{newUsername:this.newUsername}).then((function(e){sweetSuccess("修改成功"),o()})).catch((function(e){sweetError(e)}))}}});function o(e){NKC.configs.isApp&&NKC.methods.rn.emit("updateLocalUser",{})}e(window,{submit:function(e){var t={description:$("#description").val(),postSign:$("#postSign").val()};nkcAPI("/u/"+e+"/settings/info","PUT",t).then((function(e){screenTopAlert("修改成功"),o()})).catch((function(e){screenTopWarning(e.error)}))},changeUsername:function(){$("#app").toggle()},getFocus:function(e){$(e).css("border-color","#f88"),$(e).focus(),$(e).blur((function(){$(e).css("border-color","")}))},selectAvatar:function(){selectImage.show((function(e){var t=NKC.methods.getDataById("data").user,n=new FormData;Promise.resolve().then((function(){return n.append("file",e,Date.now()+".png"),uploadFilePromise("/avatar/"+t.uid,n,(function(e,t){$(".upload-info").text("上传中..."+t),e.total===e.loaded&&($(".upload-info").text("上传完成！"),setTimeout((function(){$(".upload-info").text("")}),2e3))}),"POST")})).then((function(e){$("#userAvatar").attr("src",NKC.methods.tools.getUrl("userAvatar",e.user.avatar)+"&time="+Date.now()),o(),selectImage.close()})).catch((function(e){screenTopWarning(e)}))}),{aspectRatio:1})},selectBanner:function(){selectImage.show((function(e){var t=NKC.methods.getDataById("data").user,n=new FormData;n.append("file",e,Date.now()+".png"),uploadFilePromise("/banner/"+t.uid,n,(function(e,t){$(".upload-info-banner").text("上传中..."+t),e.total===e.loaded&&($(".upload-info-banner").text("上传完成！"),setTimeout((function(){$(".upload-info-banner").text("")}),2e3))}),"POST").then((function(e){$("#userBanner").attr("src",NKC.methods.tools.getUrl("userBanner",e.user.banner)+"&time="+Date.now()),o(),selectImage.close()})).catch((function(e){screenTopWarning(e)}))}),{aspectRatio:2})},app:n,emitEventToUpdateLocalUser:o})}));
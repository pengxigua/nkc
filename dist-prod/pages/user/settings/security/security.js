!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var i=1;i<arguments.length;i++){var t=arguments[i];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e}).apply(this,arguments)}var i="86";var t={"qq.com":"http://mail.qq.com","gmail.com":"http://mail.google.com","sina.com":"http://mail.sina.com.cn","163.com":"http://mail.163.com","126.com":"http://mail.126.com","yeah.net":"http://www.yeah.net/","sohu.com":"http://mail.sohu.com/","tom.com":"http://mail.tom.com/","sogou.com":"http://mail.sogou.com/","139.com":"http://mail.10086.cn/","hotmail.com":"http://www.hotmail.com","live.com":"http://login.live.com/","live.cn":"http://login.live.cn/","live.com.cn":"http://login.live.com.cn","189.com":"http://webmail16.189.cn/webmail/","yahoo.com.cn":"http://mail.cn.yahoo.com/","yahoo.cn":"http://mail.cn.yahoo.com/","eyou.com":"http://www.eyou.com/","21cn.com":"http://mail.21cn.com/","188.com":"http://www.188.com/","foxmail.com":"http://www.foxmail.com"};var o=NKC.methods.getDataById("data"),n=new Vue({el:"#app",data:{email:o.email,type:o.email?"showEmail":"bindEmail",formType:"",oldEmailCode:"",newEmail:o.unverifiedEmail,newEmailCode:o.nationCode,newTime:0,oldTime:0},methods:{timeout:function(e){var i=this;i[e]<=0||setTimeout((function(){i[e]--,i.timeout(e)}),1e3)},reduceTime:function(e){this[e]=120,this.timeout(e)},selectBindEmail:function(){this.type="verifyOldEmail"},getEmailCode:function(e){var i=this;NKC.methods.sendEmailCode(e).then((function(){sweetSuccess("发送成功"),i.reduceTime("oldTime")})).catch(sweetError)},getOldEmailCode:function(){var e=this;nkcAPI("/u/"+o.user.uid+"/settings/email","POST",{operation:"verifyOldEmail"}).then((function(){sweetSuccess("发送成功"),e.reduceTime("oldTime")})).catch((function(e){sweetError(e)}))},getNewEmailCode:function(){var e=this;nkcAPI("/u/"+o.user.uid+"/settings/email","POST",{oldToken:this.oldEmailCode,email:this.newEmail,operation:"verifyNewEmail"}).then((function(){sweetSuccess("发送成功"),e.reduceTime("newTime")})).catch((function(e){sweetError(e)}))},getBindEmailCode:function(){var e=this;nkcAPI("/u/"+o.user.uid+"/settings/email","POST",{email:this.newEmail,operation:"bindEmail"}).then((function(){sweetSuccess("发送成功"),e.reduceTime("newTime")})).catch((function(e){sweetError(e)}))},submitChangeEmail:function(){var e="?email="+this.newEmail+"&oldToken="+this.oldEmailCode+"&token="+this.newEmailCode;nkcAPI("/u/"+o.user.uid+"/settings/email/verify"+e,"GET").then((function(){sweetSuccess("绑定成功"),window.location.reload()})).catch((function(e){sweetError(e)}))},submitBindEmail:function(){var e="?email="+this.newEmail+"&token="+this.newEmailCode;nkcAPI("/u/"+o.user.uid+"/settings/email/bind"+e,"GET").then((function(){sweetSuccess("绑定成功"),window.location.reload()})).catch((function(e){sweetError(e)}))},submitUnbindEmail:function(){var e="?token="+this.oldEmailCode;nkcAPI("/u/"+o.user.uid+"/settings/email/unbind"+e,"GET").then((function(){sweetSuccess("解绑成功"),window.location.reload()})).catch((function(e){sweetError(e)}))}}}),a=new Vue({el:"#mobileApp",data:{nationCodes:window.nationCodes,mobile:o.mobile,formType:o.mobile?"":"bind",newMobile:o.unverifiedMobile,newNationCode:o.nationCode||i,newCode:"",oldCode:"",newTime:0,oldTime:0,phoneVerify:{status:"wait",time:0,code:"",complete:!1}},methods:{timeout:function(e){var i=this;i[e]<=0||setTimeout((function(){i[e]--,i.timeout(e)}),1e3)},reduceTime:function(e){this[e]=120,this.timeout(e)},bindMobileMessage:function(){var e={mobile:this.newMobile,nationCode:this.newNationCode};if(""===e.mobile)return sweetError("请输入手机号码");var i=this;nkcAPI("/sendMessage/bindMobile","POST",e).then((function(){sweetSuccess("验证码发送成功"),i.reduceTime("newTime")})).catch((function(e){sweetError(e.error)}))},submitBindMobile:function(){var e={code:this.newCode,mobile:this.newMobile,nationCode:this.newNationCode};return""===e.code?sweetError("请输入手机验证码"):""===e.mobile?sweetError("请输入手机号码"):void nkcAPI("/u/"+NKC.configs.uid+"/settings/mobile","POST",e).then((function(){sweetSuccess("绑定成功"),window.location.reload()})).catch((function(e){sweetError(e.error)}))},sendMessage:function(e){var i=this,t={operation:"verifyOldMobile"};if(e&&(t.operation="verifyNewMobile",t.nationCode=this.newNationCode,t.mobile=this.newMobile,""===t.mobile))return sweetError("请输入新手机号");nkcAPI("/sendMessage/changeMobile","POST",t).then((function(){sweetSuccess("验证码发送成功"),e?i.reduceTime("newTime"):i.reduceTime("oldTime")})).catch((function(e){sweetError(e.error)}))},submitChangeMobile:function(){var e={oldCode:this.oldCode,code:this.newCode,mobile:this.newMobile,nationCode:this.newNationCode};return""===e.oldCode?sweetError("请输入旧手机验证码"):""===e.code?sweetError("请输入新手机验证码"):""===e.mobile?sweetError("请输入新手机号码"):void nkcAPI("/u/"+NKC.configs.uid+"/settings/mobile","PUT",e).then((function(){sweetSuccess("更改绑定成功"),window.location.reload()})).catch((function(e){sweetError(e.error)}))},unbindMobileMessage:function(){var e=this;nkcAPI("/sendMessage/unbindMobile","POST",{}).then((function(){sweetSuccess("验证码发送成功"),e.reduceTime("oldTime")})).catch((function(e){sweetError(e.error)}))},submitUnbindMobile:function(){var e=this.oldCode;if(""===e)return sweetError("请输入手机验证码");nkcAPI("/u/"+NKC.configs.uid+"/settings/mobile?code="+e,"DELETE").then((function(){sweetSuccess("解绑成功"),window.location.reload()})).catch((function(e){sweetError(e.error)}))},sendPhoneVerifySmsCode:function(){var e=this.phoneVerify;e.status="sending",nkcAPI("/u/"+NKC.configs.uid+"/phoneVerify/sendSmsCode","POST").then((function(i){var t=i.countdownLen;e.time=t,e.status="countdown";var o=setInterval((function(){e.time-=1,0===e.time&&(clearInterval(o),e.status="wait",e.time=0)}),1e3)})).catch((function(i){sweetError(i),e.status="wait",e.time=0}))},submitPhoneVerify:function(){var e=this.phoneVerify;nkcAPI("/u/"+NKC.configs.uid+"/phoneVerify","POST",{code:e.code}).then((function(){return e.complete=!0,sweetAlert("验证成功")})).then((function(){location.reload()})).catch(sweetError)}}});e(window,{submitPassword:function(e){var i={oldPassword:$("#oldPassword").val(),password:$("#password").val(),password2:$("#password2").val()};return""===i.oldPassword?sweetError("请输入旧密码"):""===i.password?sweetError("请输入新密码"):i.password!==i.password2?sweetError("两次输入的新密码不一致"):(delete i.password2,void nkcAPI("/u/"+e+"/settings/password","PUT",i).then((function(){sweetSuccess("修改成功")})).catch((function(e){sweetError(e.error)})))},nationCode:i,chooseCountryNum:function(e){i=parseInt(e)},changeNumber:function(){$("#btnChangeNumber").hide(),$("#inputDiv").show()},email:t,sendBindEmail:function(e){var i={email:$("#email").val(),operation:"bindEmail"};if(""===i.email)return sweetError("请输入邮箱地址");i.email=i.email.trim(),nkcAPI("/u/"+e+"/settings/email","POST",i).then((function(){var e=i.email.split("@")[1],o=$('<a href="'+(t[e]||"###")+'" target="_blank">'+i.email+"</a>");$("#emailInfo").html(o),$("#bindEmailDiv").show(),$('input[name="email"]').val(i.email)})).catch((function(e){sweetError(e.error||e)}))},verifyOldEmail:function(e,i){nkcAPI("/u/"+e+"/settings/email","POST",{operation:"verifyOldEmail"}).then((function(){$("#changeBtn").text("重新发送邮件");var e=i.split("@")[1],o=$('<a href="'+(t[e]||"###")+'" target="_blank">'+i+"</a>");$("#oldEmail").html(o),$("#verifyOldEmailDiv").show()})).catch((function(e){sweetError(e.error||e)}))},sendNewEmail:function(e){var i={oldToken:$("#oldToken").val(),email:$("#email").val(),operation:"verifyNewEmail"};if(""===i.email)return sweetError("请输入新邮箱地址");i.email=i.email.trim(),nkcAPI("/u/"+e+"/settings/email","POST",i).then((function(){var e=i.email.split("@")[1],o=$('<a href="'+(t[e]||"###")+'" target="_blank">'+i.email+"</a>");$("#newEmail").html(o),$('input[name="email"]').val(i.email),$("#verifyNewEmailDiv").show()})).catch((function(e){sweetError(e.error||e)}))},displayChangeDiv:function(){$("#changeSwitch").hide(),$("#changeBtnDiv").show()},data:o,app:n,mobileApp:a})}));
!function(n){"function"==typeof define&&define.amd?define(n):n()}((function(){"use strict";function n(){return(n=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n}).apply(this,arguments)}var e=$(".photoType").attr("targetUid");function t(n){$("input[name="+n+"]").eq(1).on("click",(function(){$("#"+n+"Reason").show(),$("#"+n+"Time").hide()}))}function i(n){$("input[name="+n+"]").eq(0).on("click",(function(){$("#"+n+"Reason").hide(),$("#"+n+"Time").show()}))}function r(n){$("#"+n+"Submit").on("click",(function(){var t,i=null,r=$("#"+n+"Reason").val(),o=$("#"+n+"Time input"),a=o.eq(0).val(),c=o.eq(1).val(),u=o.eq(2).val(),p=$("input[name="+n+"]").eq(0).is(":checked"),f=$("input[name="+n+"]").eq(1).is(":checked");if(!f&&!p)return screenTopWarning("请选择同意或不同意后再点击提交!");if(f){if(t=!1,""===r)return screenTopWarning("请输入原因！")}else{if(t=!0,r="",""===a||""===c||""===u)return screenTopAlert("请输入正确的时间！");if(!(i=new Date(a+" "+c+" "+u)))return screenTopWarning("请输入正确的时间！")}nkcAPI("/auth/"+e,"PUT",{reason:r,status:t,type:n,time:i}).then((function(){screenTopAlert("提交成功！")})).catch((function(n){screenTopWarning(n.error)}))}))}$((function(){for(var n=$(".photoType"),e=0;e<n.length;e++){var o=n.eq(e).attr("name");t(o),i(o),r(o)}})),n(window,{targetUid:e,displayInput:t,disappearInput:i,submit:r})}));
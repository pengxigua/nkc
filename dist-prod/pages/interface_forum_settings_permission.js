!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var i=arguments[n];for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t])}return e}).apply(this,arguments)}function n(e){return $("#"+e).hasClass("fa-toggle-on")}$('input[name="selectRole"],input[name="allowedAnonymousPost"], input[name="selectGrade"], input[name="selectRelation"], input[name="subType"], input[name="openReduceVisits"]').iCheck({checkboxClass:"icheckbox_minimal-red",radioClass:"iradio_minimal-red"}),e(window,{switchStatus:n,submit:function(e){for(var i,t=[],a=[],r=$('input[name="selectRole"]'),o=0;o<r.length;o++){var s=(c=r.eq(o)).attr("data-id");c.prop("checked")&&-1===t.indexOf(s)&&t.push(s)}for(r=$('input[name="selectGrade"]'),o=0;o<r.length;o++){var c,p=(c=r.eq(o)).attr("data-id");c.prop("checked")&&-1===a.indexOf(p)&&a.push(p)}i=$('input[name="selectRelation"]').eq(0).prop("checked")?"and":"or";var l=$("input[name='subType']"),u="";if(l.eq(0).prop("checked")?u="force":l.eq(1).prop("checked")?u="free":l.eq(2).prop("checked")&&(u="unSub"),!u)return screenTopWarning("请选择关注类型");var d=$("input[name='allowedAnonymousPost']");d=d.eq(0).prop("checked");var m=$("input[name='openReduceVisits']");m=m.eq(0).prop("checked");var f={klass:$("#contentClass").val(),accessible:n("accessible"),displayOnParent:n("displayOnParent"),visibility:n("visibility"),isVisibleForNCC:n("isVisibleForNCC"),rolesId:t,gradesId:a,relation:i,shareLimitCount:$("#shareLimitCount").val(),shareLimitTime:$("#shareLimitTime").val(),moderators:$("#moderators").val(),subType:u,allowedAnonymousPost:d,openReduceVisits:m};nkcAPI("/f/"+e+"/settings/permission","PUT",f).then((function(){screenTopAlert("保存成功")})).catch((function(e){screenTopWarning(e.error||e)}))},libraryOperation:function(e,n){nkcAPI("/f/"+e+"/library","POST",{type:n}).then((function(){sweetSuccess("执行成功")})).catch((function(e){sweetError(e)}))}})}));
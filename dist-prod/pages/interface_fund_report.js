!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e}).apply(this,arguments)}var n=[];function t(e,n){var t=e.page||0,a=e.pageCount||1;if(a<=1)return"";var r,i,o="",s=t-3,c=t+3;s>0?c>a?(i=a,r=s-(c-a)<0?0:s-(c-a)):(i=c,r=s):(r=0,i=c<a?a<c-s?a:c-s:a-1),console.log(r,t,i),void 0===n&&(n="");for(var d=0;d<a;d++)if(!(d<r||d>i)){var l="";t===d&&(l="active"),o+='<li class="'+l+'"><a onclick="getThreads('+d+","+n+')">'+(d+1)+"</a></li>"}return o}function a(e,n){var a=t(e,n);$(".pageList").html(a)}function r(e,n,t){var a="",r="";t=!0===t?"disabled":"","add"===n?(a="addThread",r="glyphicon glyphicon-plus"):(a="deleteThread",r="glyphicon glyphicon-remove");for(var i="",o=0;o<e.length;o++){var s=e[o],c=s.tid,d=s.uid,l=s.pid,p=s.username,u=s.t,h=s.toc;i+='<div class="threadList">'+('<div class="col-xs-10 col-md-10"><div class="postString displayNone">'+JSON.stringify(s)+'</div><span>文号：</span><span class="threadNumber">'+l+'&nbsp;&nbsp;</span><a href="/m/'+d+'" target="_blank">'+p+"</a><span>&nbsp;发表于 "+h+'</span><br><a href="/t/'+c+'" target="_blank">'+u+"</a></div>")+('<div class="col-xs-2 col-md-2 delete '+t+" "+r+'" onclick="'+a+"('"+c+"','"+l+"');this.style.backgroundColor = '#2aabd2';\"></div>")+"</div>"}return i}function i(e,n,t,a){var i;""===(i=r(n,"add"===a?"add":"delete",t))&&(i='<div class="blank blank-selectedThread">暂无数据</div>',$(e).html()),$(e).html(i)}function o(){var e="";0===n.length&&(e="<span>暂未选择</span>");for(var t=0;t<n.length;t++)e+='<span class="fund-span selectedUser selected" onclick="deleteThread(\''+n[t].tid+"')\">"+n[t].pid+'<span class="fund-span delete glyphicon glyphicon-remove"></span></span>';$("#selectedThread").html(e)}e(window,{submit:function(e){var n=$("#content").val();if(!n)return screenTopWarning("内容不能为空。");nkcAPI("/fund/a/"+e+"/report","POST",{c:n}).then((function(){window.location.reload()})).catch((function(e){screenTopWarning(e.error)}))},getThreads:function(e,n){var t;if(e=void 0!==e?"page="+e+"&":"",void 0===n){var r=$("#searchThread").val();if(""===r)return screenTopWarning("输入不能为空！");t="/t?"+e+"from=applicationForm&applicationFormId="+applicationFormId+"&keywords="+r}else t="/t?"+e+"from=applicationForm&self=true";$(".unselectedThreads").html('<div class="blank blank-selectedThread">搜索中...</div>'),nkcAPI(t,"GET",{}).then((function(e){tempThreads=e.threads,a(e.paging,n),0===tempThreads.length&&screenTopAlert("什么也没找到..."),i(".unselectedThreads",tempThreads,!1,"add")})).catch((function(e){screenTopWarning(e.error);$(".unselectedThreads").html('<div class="blank blank-selectedThread">error</div>')}))},createPageList:t,displayPageList:a,createThreadsList:r,disabledRolling:function(e){$(window).scrollTop(e)},initThreadsList:function(){for(var e=$(".selectedThreads .threadList .postString"),t=e.length,a=0;a<t;a++){var r=e.eq(a).text(),i=JSON.parse(r);n.push(i)}},displayThreadsList:i,deleteThread:function(e,t){for(var a=0;a<n.length;a++)n[a].tid===e&&n.splice(a,1);o()},addThread:function(e,t){for(var a=!1,r=0;r<n.length;r++)if(n[r].tid===e){a=!0;break}a||n.push({tid:e,pid:t}),o()},displaySelectedThreads:o,clearLog:function(){$(".unselectedThreads").html('<div class="blank" style="color:#aaa;">暂无数据</div>')},submitReport:function(e){var t=$("#reportContent").val();if(!t)return screenTopWarning("请输入中期报告。");nkcAPI("/fund/a/"+e+"/report","POST",{c:t,type:"applyRemittance",selectedThreads:n}).then((function(){screenTopAlert("提交成功!"),setTimeout((function(){window.location.reload()}),1200)})).catch((function(e){screenTopWarning(e.error)}))},submittedReportAudit:function(e,n,t){var a=$("#content").val(),r={number:t};if(!1===e){if(r.support=!1,!a)return screenTopWarning("请输入审核意见。")}else r.support=!0;r.c=a,nkcAPI("/fund/a/"+n+"/report/audit","POST",r).then((function(){screenTopAlert("提交成功。"),r.support?openToNewLocation("/fund/a/"+n):setTimeout((function(){openToNewLocation("/fund/a/"+n)}),1200)})).catch((function(e){screenTopWarning(e.error)}))},disabledReport:function(e,n,t){nkcAPI("/fund/a/"+e+"/report/"+n+"?type="+t,"DELETE",{}).then((function(){window.location.reload()})).catch((function(e){screenTopWarning(e.error)}))}})}));
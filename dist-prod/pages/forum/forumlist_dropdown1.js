!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var t=[];window.cat=void 0;var n=$("#dropdownDiv1"),r=JSON.parse($("#forumListData1").text()),i=r.forumList,a=r.forumsThreadTypes,o=r.disabledCategory;function l(){$(".dropdownSelect1").on("change",(function(){if(!$(this).hasClass("categorySelect1")){var e=$(this).attr("id").split("selecta")[1],n=$(this).val().split(":")[1];if(t.splice(e,1,n),t.length>0)for(var r=[],i=0;i<t.length;i++)i>=e&&$("#selecta"+i).remove(),i<=e&&r.push(t[i]);window.selectedArr=r,d()}}))}function c(e,t,n){var r="请选择专业",i="form-control dropdownSelect1";n&&(r="请选择文章分类",i="form-control dropdownSelect1 categorySelect1");var a=newElement("select",{class:i},{width:"auto",display:"inline-block","margin-right":"0.2rem"});a.append(newElement("option",{},{}).text(r));for(var o=0;o<e.length;o++){var l=e[o];if(n){c=newElement("option",{},{}).text(l.name);l.cid===t&&c.attr("selected",!0)}else{if("discipline"==l.forumType)var c=newElement("option",{},{}).text("(学科)"+l.displayName+":"+l.fid);else var c=newElement("option",{},{}).text("(话题)"+l.displayName+":"+l.fid);l.fid===t&&c.attr("selected",!0)}a.append(c)}return a}function d(){if(n.html(""),0!==t.length)for(var e=0;e<t.length;e++){0===e&&n.append(c(s(),t[e]).attr("id","selecta"+e));var r=f(t[e]);if(0===r.length){if(o)return openToNewLocation("/f/"+t[e]+"/settings");var i=p(t[e]);i.push({name:"不分类",cid:""}),n.append(c(i,cat||"",!0))}else n.append(c(r,t[e+1]).attr("id","selecta"+(e+1)))}else n.append(c(s(),"").attr("id","selecta0"));setTimeout((function(){l()}),300)}function s(){for(var e=[],t=0;t<i.length;t++)0==i[t].parentsId.length&&e.push(i[t]);return e}function f(e){for(var t=[],n=0;n<i.length;n++)i[n].parentsId.indexOf(e)>-1&&t.push(i[n]);return t}function p(e){for(var t=[],n=0;n<a.length;n++)a[n].fid===e&&t.push(a[n]);return t}r.selectedArr&&(window.selectedArr=r.selectedArr),r.cat&&(window.cat=parseInt(r.cat)),d(),e(window,{dropdownDiv1:n,forumList:i,threadTypes:a,disabledCategory:o,initEvent1:l,createSelect1:c,displaySelect1:d,parentForum1:s,getChildrenForums1:f,getThreadTypes1:p,getResult1:function(){for(var e,t,n,r=$("#dropdownDiv1 select"),i=0;i<r.length;i++)if(!r.eq(i).hasClass("categorySelect1")){var o=r.eq(i).val().split(":");if(2!==o.length)throw"请选择专业";e=o[1]}if("请选择文章分类"===(t=$(".categorySelect1").val()))throw"请选择文章分类";if(!e)throw"请选择专业";for(i=0;i<a.length;i++)if(a[i].fid===e&&a[i].name===t){n=a[i].cid;break}return{fid:e,cid:n}},selectbtn:function(){for(var e=$("input.ThreadCheckboxes"),t=!1,n=0;n<e.length;n++)e.eq(n).is(":checked")&&(t=!0);t?e.prop("checked",!1):e.prop("checked",!0)}})}));
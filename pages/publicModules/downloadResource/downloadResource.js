!function n(i,r,a){function s(t,o){if(!r[t]){if(!i[t]){var e="function"==typeof require&&require;if(!o&&e)return e(t,!0);if(c)return c(t,!0);throw(e=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",e}e=r[t]={exports:{}},i[t][0].call(e.exports,function(o){return s(i[t][1][o]||o)},e,e.exports,n,i,r,a)}return r[t].exports}for(var c="function"==typeof require&&require,o=0;o<a.length;o++)s(a[o]);return s}({1:[function(o,t,e){"use strict";var n;NKC.modules.downloadResource=function(){function t(){!function(o){if(!(o instanceof t))throw new TypeError("Cannot call a class as a function")}(this);var n=this;n.dom=$("#moduleDownloadResource"),n.app=new Vue({el:"#moduleDownloadResourceApp",data:{rid:"",fileName:"未知",type:"",size:0,costs:[],hold:[],status:"loadding",fileCountLimitInfo:"",errorInfo:"",settingNoNeed:!1},computed:{costMessage:function(){return this.costs.map(function(o){return o.name+o.number}).join("、")},holdMessage:function(){return this.hold.map(function(o){return o.name+o.number}).join("、")}},methods:{fromNow:NKC.methods.fromNow,initDom:function(){n.dom.css({height:"37rem"}),n.dom.draggable({scroll:!1,handle:".module-sd-title",drag:function(o,t){t.position.top<0&&(t.position.top=0);var e=$(window).height();t.position.top>e-30&&(t.position.top=e-30);e=n.dom.width();t.position.left<100-e&&(t.position.left=100-e);e=$(window).width();t.position.left>e-100&&(t.position.left=e-100)}});var o=$(window).width();o<700?n.dom.css({width:.8*o,top:0,right:0}):n.dom.css("left",.5*(o-n.dom.width())-20),n.dom.show()},getResourceInfo:function(o){var r=this;r.status="loadding",r.errorInfo="",nkcAPI("/r/".concat(o,"/detail"),"GET").then(function(o){var t=o.detail,e=t.free,n=t.paid,i=t.resource,o=t.costScores,t=t.fileCountLimitInfo;r.fileCountLimitInfo=t,r.status=e||n?"noNeedScore":"needScore",r.free=e,r.paid=n,r.fileName=i.oname,r.rid=i.rid,r.type=i.ext,r.size=NKC.methods.getSize(i.size),o&&(r.costs=o.map(function(o){return{name:o.name,number:o.addNumber/100*-1}}),r.hold=o.map(function(o){return{name:o.name,number:o.number/100}}))}).catch(function(o){r.fileCountLimitInfo=o.fileCountLimitInfo,r.status="error",r.errorInfo=o.error||o.message||o})},download:function(){var o=this,t=this.rid,e=this.fileName;nkcAPI("/r/".concat(t,"/pay"),"POST").then(function(){var o=document.createElement("a");o.setAttribute("download",e),o.href="/r/".concat(t),o.click()}).catch(sweetError).then(function(){return o.getResourceInfo(o.rid)})},open:function(o){this.status="loadding",this.initDom(),this.getResourceInfo(o)},close:function(){n.dom.hide()}}}),n.open=n.app.open,n.close=n.app.close}return t}(),n=new NKC.modules.downloadResource,[].slice.call($("[data-tag='nkcsource'][data-type='attachment']")).forEach(function(t){$(t).find("a.article-attachment-name").on("click",function(o){o.preventDefault(),o.stopPropagation();o=$(t).attr("data-id");return n.open(o),!1})})},{}]},{},[1]);

!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";var e=NKC.methods.getDataById("data");new Vue({el:"#app",data:{reviews:e.reviews},methods:{format:NKC.methods.format,fromNow:NKC.methods.fromNow,toCh:function(e){return{disabledPost:"删除",disabledThread:"删除",returnPost:"退修",returnThread:"退修",passPost:"通过审核",passThread:"通过审核"}[e]}}})}));
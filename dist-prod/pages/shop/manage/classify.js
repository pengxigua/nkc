!function(n){"function"==typeof define&&define.amd?define(n):n()}((function(){"use strict";function n(){return(n=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(n[o]=a[o])}return n}).apply(this,arguments)}n(window,{addClassify:function(n){var e=prompt("Please enter newClassify","");(e=e.trim())&&nkcAPI("/shop/manage/"+n+"/classify/add","POST",{newClassifyName:e}).then((function(e){screenTopAlert("添加成功"),openToNewLocation("/shop/manage/"+n+"/classify")})).catch((function(n){screenTopWarning(n||n.error)}))},delClassify:function(n,e){var a=e.trim();nkcAPI("/shop/manage/"+n+"/classify/del","POST",{classifyName:a}).then((function(e){screenTopAlert("删除成功"),openToNewLocation("/shop/manage/"+n+"/classify")})).catch((function(n){screenTopWarning(n||n.error)}))}})}));
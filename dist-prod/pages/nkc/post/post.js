!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";window.moveThread=function(e){window.MoveThread||(window.MoveThread=new NKC.modules.MoveThread);var o=NKC.methods.getDataById("data_".concat(e));window.MoveThread.open((function(e){var n=e.forums,t=e.moveType;MoveThread.lock(),nkcAPI("/threads/move","POST",{forums:n,moveType:t,threadsId:[o.tid]}).then((function(){screenTopAlert("操作成功"),MoveThread.close()})).catch((function(e){sweetError(e),MoveThread.unlock()}))}),{selectedCategoriesId:o.categoriesId,selectedForumsId:o.mainForumsId})},window.deleteThread=function(e){window.DisabledPost||(window.DisabledPost=new NKC.modules.DisabledPost),window.DisabledPost.open((function(o){var n,t=o.type,d=o.reason,s=o.remindUser,r=o.violation,a={postsId:[e],reason:d,remindUser:s,violation:r};n="toDraft"===t?"/threads/draft":"/threads/recycle",DisabledPost.lock(),nkcAPI(n,"POST",a).then((function(){screenTopAlert("操作成功"),DisabledPost.close(),DisabledPost.unlock()})).catch((function(e){sweetError(e),DisabledPost.unlock()}))}))}}));
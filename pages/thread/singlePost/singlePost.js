!function o(i,a,r){function s(e,t){if(!a[e]){if(!i[e]){var n="function"==typeof require&&require;if(!t&&n)return n(e,!0);if(d)return d(e,!0);throw(n=new Error("Cannot find module '"+e+"'")).code="MODULE_NOT_FOUND",n}n=a[e]={exports:{}},i[e][0].call(n.exports,function(t){return s(i[e][1][t]||t)},n,n.exports,o,i,a,r)}return a[e].exports}for(var d="function"==typeof require&&require,t=0;t<r.length;t++)s(r[t]);return s}({1:[function(t,e,n){"use strict";function r(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return s(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return s(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var o=0,e=function(){};return{s:e,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,r=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return a=t.done,t},e:function(t){r=!0,i=t},f:function(){try{a||null==n.return||n.return()}finally{if(r)throw i}}}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function i(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var o=new(function(){function e(){!function(t){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this),this.editors={},this.tid=null,this.cWriteInfo=!0,this.postPermission={permit:!1,warning:null}}var t,n,o;return t=e,(n=[{key:"getPostHeightFloat",value:function(){var t=$('.hidden[data-type="hidePostContentSettings"]');if(!t.length)throw"未读取到与post内容隐藏相关的配置";return(t=NKC.methods.strToObj(t.html())).float}},{key:"getPostMaxHeight",value:function(){var t=$(document).width(),e=$('.hidden[data-type="hidePostContentSettings"]');if(!e.length)throw"未读取到与post内容隐藏相关的配置";return e=NKC.methods.strToObj(e.html()),t<768?e.xs:t<992?e.sm:e.md}},{key:"autoHidePostContent",value:function(){for(var t=$(".single-post-container"),e=0;e<t.length;e++){var n=t.eq(e),o=n.attr("data-hide"),i=n.attr("data-pid");"not"!==o&&this.getPostMaxHeight()<n.find(".single-post-center").height()&&this.hidePostContent(i)}}},{key:"hidePostContent",value:function(t){var e=$('.single-post-container[data-pid="'.concat(t,'"]')),n=e.find(".single-post-center"),o=this.getPostHeightFloat(),t=this.getPostMaxHeight();n.css({"max-height":t*o+"px"});o=e.find(".switch-hidden-status");o.find(".switch-hidden-status-button").html('<div class="fa fa-angle-down"><strong> 加载全文</strong></div>'),e.attr("data-hidden","true"),o.removeClass("hidden")}},{key:"showPostContent",value:function(t){var e=$('.single-post-container[data-pid="'.concat(t,'"]'));e.find(".single-post-center").css({"max-height":"none"});t=e.find(".switch-hidden-status");t.find(".switch-hidden-status-button").html('<div class="fa fa-angle-up"> 收起</div>'),e.attr("data-hidden","false"),t.removeClass("hidden")}},{key:"switchPostContent",value:function(t){var e;"true"===$('.single-post-container[data-pid="'.concat(t,'"]')).attr("data-hidden")?(e=$(document).scrollTop(),this.showPostContent(t),scrollTo(0,e)):(e=new NKC.modules.PagePosition,this.hidePostContent(t),e.restore())}},{key:"getPostContainer",value:function(t){return $('.single-post-container[data-pid="'.concat(t,'"]'))}},{key:"getCommentContainer",value:function(t){return $('[data-type="singlePostCommentContainer"][data-pid="'.concat(t,'"]'))}},{key:"getSingleComment",value:function(t){return $('.single-comment[data-pid="'.concat(t,'"]'))}},{key:"getCommentButton",value:function(t){return $('[data-type="singlePostCommentButton"][data-pid="'.concat(t,'"]'))}},{key:"createCommentElements",value:function(t){var e=$('.single-comments[data-pid="'.concat(t,'"]'));return e=!e.length?$('<div class="single-comments" data-pid="'.concat(t,'"></div>')):e}},{key:"getPages",value:function(t,e){var n=$('.single-comment-paging[data-pid="'.concat(t,'"]'));(n=!n.length?$('<div class="single-comment-paging" data-pid="'.concat(t,'"></div>')):n).html("");var o=r(e.buttonValue);try{for(o.s();!(a=o.n()).done;){var i=a.value,a=$('<span class="'.concat(i.type,'">..</span>'));"null"!==i.type&&(a.text(i.num+1),a.attr("onclick","NKC.methods.getPostCommentsByPage('".concat(t,"', ").concat(i.num,")"))),n.append(a)}}catch(t){o.e(t)}finally{o.f()}return n}},{key:"switchPostBackgroundColor",value:function(t,e){this.getPostContainer(t).attr("data-show-comments",e?"true":"false")}},{key:"showPostComment",value:function(a){var r=this,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,e=(2<arguments.length&&void 0!==arguments[2]?arguments[2]:{}).highlightCommentId,s=void 0===e?null:e;this.removeAllEditorApp(a);var d=this,c=this.getCommentContainer(a);this.switchPostBackgroundColor(a,!0);var n=this.getCommentButton(a),o=c.find(".single-post-comment-loading"),e=c.find(".single-post-comment-error");0<o.length&&o.remove(),0<e.length&&e.remove();var m=$("<div class=\"single-post-comment-loading\"><div class='fa fa-spinner fa-spin'></div>加载中...</div>");"true"!==c.attr("data-opened")&&c.append(m),c.attr("data-hide","false"),n.attr("data-show-number","false"),this.renderPostCommentNumber(a),this.getPostComments(a,t).then(function(t){m.remove();var e=t.tid,n=t.htmlContent,o=t.paging,i=t.postPermission;o.page+1>=o.pageCount?c.attr("data-last-page","true"):c.attr("data-last-page","false"),d.postPermission=i,d.tid=e;e=r.createCommentElements(a);e.html(n);o=d.getPages(a,o);"true"!==c.attr("data-opened")&&(c.append(o),c.append(e),c.append(o.clone(!0)),c.attr("data-opened","true"));o=d.getEditorApp(a,c,{cancelEvent:"switchPostComment",keepOpened:!0,position:"bottom"});r.cWriteInfo=t.cWriteInfo,t.cWriteInfo?c.append($('<div class="text-danger single-post-comment-error">'.concat(t.cWriteInfo,"</div>"))):(o.show=!0,o.container.show()),s&&(o=$('.single-comment[data-pid="'.concat(s,'"]>.single-comment-center')),NKC.methods.scrollToDom(o),NKC.methods.markDom(o)),d.autoSaveDraft(a)}).then(function(){d.initNKCSource()}).catch(function(t){t=$('<div class="single-post-comment-error text-danger">'.concat(t.error,"</div>"));c.html(t)})}},{key:"initNKCSource",value:function(){floatUserPanel.initPanel(),NKC.methods.initSharePanel(),NKC.methods.initPostOption(),NKC.methods.initStickerViewer(),NKC.configs.isApp||NKC.methods.initImageViewer(),NKC.methods.initVideo()}},{key:"removeAllEditorApp",value:function(t){for(var e=this.getCommentContainer(t).find(".single-comment"),n=0;n<e.length;n++){var o=e.eq(n);this.removeEditorApp(o.attr("data-pid"))}this.removeEditorApp(t)}},{key:"hidePostComment",value:function(t){this.switchPostBackgroundColor(t,!1);var e=this.getCommentContainer(t),n=this.getCommentButton(t);e.attr("data-hide","true"),n.attr("data-show-number","true"),this.renderPostCommentNumber(t)}},{key:"renderPostCommentNumber",value:function(t){var e,n=this.getCommentButton(t),t=Number(n.attr("data-number"));"true"===n.attr("data-show-number")?(e="评论",0<t&&(e+="(".concat(t,")"))):e="折叠评论",n.text(e)}},{key:"setPostCommentNumber",value:function(t){var e=this.getCommentButton(t),t=Number(e.attr("data-number"));e.attr("data-number",t+1)}},{key:"switchPostComment",value:function(t,e,n){"false"===this.getCommentContainer(t).attr("data-hide")?e?(e=new NKC.modules.PagePosition,this.hidePostComment(t),e.restore()):this.hidePostComment(t):this.showPostComment(t,n)}},{key:"getPostComments",value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return nkcAPI("/p/".concat(t,"/comments?page=").concat(e),"GET")}},{key:"removeEditorApp",value:function(t){var e=this.getEditorAppData(t);e&&(clearTimeout(e.timeoutId),e.app&&e.app.destroy&&e.app.destroy(),e.container&&e.container.remove&&e.container.remove(),delete this.editors[t])}},{key:"getEditorAppData",value:function(t){return this.editors[t]}},{key:"getEditorApp",value:function(t,e){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};n.keepOpened=n.keepOpened||!1;var o,i,a,r=n.cancelEvent,s=void 0===r?"switchCommentForm":r,d=n.position,c=void 0===d?"top":d;return void 0===this.editors[t]&&(o=e,r=$('<div class="single-comment-editor-container"></div>'),(d=$('<div class="single-comment-warning"></div>')).html(this.postPermission.warning),r.append(d),this.postPermission.permit&&(i=$('<div class="single-comment-editor" id="singlePostEditor_'.concat(t,'">')),e=$('<div class="single-comment-prompt">200字以内，仅用于支线交流，主线讨论请采用回复功能。</div>'),d=$('<div class="single-comment-button"></div>'),s="NKC.methods.".concat(s,'("').concat(t,'", true)'),d.append($('<button class="btn btn-default btn-sm" onclick=\''.concat(s,"'>取消</button>"))),d.append($('<button class="btn btn-default btn-sm" onclick="NKC.methods.saveDraft(\''.concat(t,"')\">存草稿</button>"))),d.append($('<button class="btn btn-primary btn-sm" data-type="post-button" onclick="NKC.methods.postData(\''.concat(t,"')\">提交</button>"))),r.append(e).append(i).append(d)),"top"===c?o.prepend(r):o.append(r),i&&(a=UE.getEditor(i.attr("id"),NKC.configs.ueditor.commentConfigs)),r.hide(),this.editors[t]={app:a,draftId:null,options:n,container:r,pid:t,show:!1,timeoutId:null}),this.editors[t]}},{key:"switchCommentForm",value:function(t){if(!NKC.configs.uid)return NKC.methods.toLogin();var e=this.getSingleComment(t);if(e.find(".single-post-comment-error").remove(),this.cWriteInfo)return e.append($('<div class="single-post-comment-error text-danger">'.concat(this.cWriteInfo,"</div>")));e=e.children(".single-comment-bottom"),e=this.getEditorApp(t,e);e.show?e.options.keepOpened||(e.show=!1,e.container.hide(),clearTimeout(e.timeoutId),this.removeEditorApp(t)):(e.show=!0,e.container.show(),this.autoSaveDraft(t))}},{key:"getEditorContent",value:function(t){return this.getEditorApp(t).app.getContent()}},{key:"clearEditorContent",value:function(t){this.getEditorApp(t).app.setContent("")}},{key:"changeEditorButtonStatus",value:function(t,e){t=this.getEditorApp(t).container.find("[data-type=post-button]");t.attr("disabled",e),e?t.html('<div class="fa fa-spinner fa-spin"></div> 提交中...'):t.html("提交")}},{key:"postData",value:function(e){var t=this.getEditorContent(e),n=this;return Promise.resolve().then(function(){if(!t)throw"评论内容不能为空";return n.changeEditorButtonStatus(e,!0),nkcAPI("/t/"+n.tid,"POST",{postType:"comment",post:{c:t,l:"html",parentPostId:e}})}).then(function(t){screenTopAlert("发表成功");t=t.renderedPost;n.clearEditorContent(e),n.changeEditorButtonStatus(e,!1),n.switchCommentForm(e),t&&n.insertComment(t.parentCommentId,t.parentPostId,t.html)}).catch(function(t){sweetError(t),n.changeEditorButtonStatus(e,!1)})}},{key:"saveDraftData",value:function(t){var e=this.getEditorApp(t),n=this.getEditorContent(t),o=this;return Promise.resolve().then(function(){if(n)return nkcAPI("/u/".concat(NKC.configs.uid,"/drafts"),"POST",{post:{c:n,l:"html"},draftId:e.draftId,desType:"thread",desTypeId:o.tid})}).then(function(t){return t?(e.draftId=t.draft.did,{saved:!0}):{saved:!1,error:"草稿内容不能为空"}})}},{key:"saveDraft",value:function(t){this.saveDraftData(t).then(function(t){var e=t.saved,t=t.error;e?sweetSuccess("草稿已保存"):sweetError(t)}).catch(sweetError)}},{key:"autoSaveDraft",value:function(e){var n=this,t=n.getEditorApp(e);t&&t.show&&(clearTimeout(t.timeoutId),t.timeoutId=setTimeout(function(){n.saveDraftData(e).then(function(){n.autoSaveDraft(e)}).catch(function(t){screenTopWarning(t),n.autoSaveDraft(e)})},1e4))}},{key:"insertComment",value:function(t,e,n){var o=this.getCommentContainer(t);if(o.length){if("false"===o.attr("data-last-page"))return;o.children('.single-comments[data-pid="'.concat(t,'"]')).children('.single-comments[data-pid="'.concat(t,'"]')).append($(n))}else this.getSingleComment(t).children(".single-comment-bottom").children('.single-comments[data-pid="'.concat(t,'"]')).append($(n));this.setPostCommentNumber(e,1),this.renderPostCommentNumber(e),this.initNKCSource()}}])&&i(t.prototype,n),o&&i(t,o),e}());NKC.methods.autoHidePostContent=function(){o.autoHidePostContent()},NKC.methods.switchPostContent=function(t){o.switchPostContent(t)},NKC.methods.switchPostComment=function(t,e,n){o.switchPostComment(t,e,n)},NKC.methods.switchCommentForm=function(t){o.switchCommentForm(t)},NKC.methods.postData=function(t){o.postData(t)},NKC.methods.saveDraft=function(t){o.saveDraft(t)},NKC.methods.getPostCommentsByPage=function(t,e){o.showPostComment(t,e)},NKC.methods.showPostComment=function(t,e,n){o.showPostComment(t,e,n)},NKC.methods.insertComment=function(t,e,n){o.insertComment(t,e,n)}},{}]},{},[1]);
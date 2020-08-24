(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

NKC.modules.SelectDraft = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);

    var self = this;
    self.dom = $("#moduleSelectDraft");
    self.app = new Vue({
      el: "#moduleSelectDraftApp",
      data: {
        uid: NKC.configs.uid,
        paging: {},
        perpage: 7,
        loading: true,
        drafts: []
      },
      methods: {
        fromNow: NKC.methods.fromNow,
        initDom: function initDom() {
          var height = "43.5rem";
          self.dom.css({
            height: height
          });
          self.dom.draggable({
            scroll: false,
            handle: ".module-sd-title",
            drag: function drag(event, ui) {
              if (ui.position.top < 0) ui.position.top = 0;
              var height = $(window).height();
              if (ui.position.top > height - 30) ui.position.top = height - 30;
              var width = self.dom.width();
              if (ui.position.left < 100 - width) ui.position.left = 100 - width;
              var winWidth = $(window).width();
              if (ui.position.left > winWidth - 100) ui.position.left = winWidth - 100;
            }
          });
          var width = $(window).width();

          if (width < 700) {
            // 小屏幕
            self.dom.css({
              "width": width * 0.8,
              "top": 0,
              "right": 0
            });
          } else {
            // 宽屏
            self.dom.css("left", (width - self.dom.width()) * 0.5 - 20);
          }

          self.dom.show();
        },
        getDraftInfo: function getDraftInfo(draft) {
          var type = draft.type,
              thread = draft.thread,
              forum = draft.forum;
          var info = "";

          if (type === "newThread") {
            info = "\u53D1\u8868\u6587\u7AE0";
          } else if (type === "newPost") {
            info = "\u5728\u6587\u7AE0\u300A".concat(thread.title, "\u300B\u4E0B\u53D1\u8868\u56DE\u590D");
          } else if (type === "modifyPost") {
            info = "\u4FEE\u6539\u6587\u7AE0\u300A".concat(thread.title, "\u300B\u4E0B\u7684\u56DE\u590D");
          } else if (type === "modifyThread") {
            info = "\u4FEE\u6539\u6587\u7AE0\u300A".concat(thread.title, "\u300B");
          } else {
            info = "\u4FEE\u6539\u4E13\u4E1A\u300A".concat(forum.title, "\u300B\u7684\u4E13\u4E1A\u8BF4\u660E");
          }

          return info;
        },
        insert: function insert(data) {
          var content = NKC.methods.ueditor.setContent(data.content);
          self.callback({
            content: content
          });
          data.delay = 3;

          var func = function func() {
            setTimeout(function () {
              data.delay--;

              if (data.delay > 0) {
                func();
              }
            }, 1000);
          };

          func();
        },
        removeDraft: function removeDraft(draft) {
          var _this = this;

          sweetQuestion("确定要删除草稿吗？").then(function () {
            nkcAPI('/u/' + _this.uid + "/drafts/" + draft.did, "DELETE").then(function () {
              self.app.getDrafts(self.app.paging.page);
            })["catch"](function (data) {
              sweetError(data);
            });
          });
        },
        getDrafts: function getDrafts() {
          var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          nkcAPI("/u/".concat(this.uid, "/profile/draft?page=").concat(page, "&perpage=").concat(this.perpage), "GET").then(function (data) {
            data.drafts.map(function (d) {
              d.delay = 0;
            });
            self.app.drafts = data.drafts;
            self.app.paging = data.paging;
            self.app.loading = false;
          })["catch"](sweetError);
        },
        loadDraft: function loadDraft(d) {
          sweetQuestion("\u7EE7\u7EED\u521B\u4F5C\u5C06\u4F1A\u8986\u76D6\u7F16\u8F91\u5668\u4E2D\u5168\u90E8\u5185\u5BB9\uFF0C\u786E\u5B9A\u7EE7\u7EED\uFF1F").then(function () {
            if (window.PostInfo && window.PostInfo.showCloseInfo) {
              window.PostInfo.showCloseInfo = false;
            }

            window.location.href = "/editor?type=redit&id=".concat(d.did);
          })["catch"](sweetError);
        },
        refresh: function refresh() {
          this.getDrafts(self.app.paging.page);
        },
        open: function open(callback) {
          self.callback = callback;
          this.initDom();
          this.getDrafts();
        },
        close: function close() {
          self.dom.hide();
        }
      }
    });
    self.open = self.app.open;
    self.close = self.app.close;
  }

  return _class;
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWdlcy9wdWJsaWNNb2R1bGVzL3NlbGVjdERyYWZ0L3NlbGVjdERyYWZ0Lm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQSxHQUFHLENBQUMsT0FBSixDQUFZLFdBQVo7QUFDRSxvQkFBYztBQUFBOztBQUNaLFFBQU0sSUFBSSxHQUFHLElBQWI7QUFDQSxJQUFBLElBQUksQ0FBQyxHQUFMLEdBQVcsQ0FBQyxDQUFDLG9CQUFELENBQVo7QUFDQSxJQUFBLElBQUksQ0FBQyxHQUFMLEdBQVcsSUFBSSxHQUFKLENBQVE7QUFDakIsTUFBQSxFQUFFLEVBQUUsdUJBRGE7QUFFakIsTUFBQSxJQUFJLEVBQUU7QUFDSixRQUFBLEdBQUcsRUFBRSxHQUFHLENBQUMsT0FBSixDQUFZLEdBRGI7QUFFSixRQUFBLE1BQU0sRUFBRSxFQUZKO0FBR0osUUFBQSxPQUFPLEVBQUUsQ0FITDtBQUlKLFFBQUEsT0FBTyxFQUFFLElBSkw7QUFLSixRQUFBLE1BQU0sRUFBRTtBQUxKLE9BRlc7QUFTakIsTUFBQSxPQUFPLEVBQUU7QUFDUCxRQUFBLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBSixDQUFZLE9BRGQ7QUFFUCxRQUFBLE9BRk8scUJBRUc7QUFDUixjQUFNLE1BQU0sR0FBRyxTQUFmO0FBQ0EsVUFBQSxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsQ0FBYTtBQUNYLFlBQUEsTUFBTSxFQUFOO0FBRFcsV0FBYjtBQUdBLFVBQUEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFULENBQW1CO0FBQ2pCLFlBQUEsTUFBTSxFQUFFLEtBRFM7QUFFakIsWUFBQSxNQUFNLEVBQUUsa0JBRlM7QUFHakIsWUFBQSxJQUFJLEVBQUUsY0FBUyxLQUFULEVBQWdCLEVBQWhCLEVBQW9CO0FBQ3hCLGtCQUFHLEVBQUUsQ0FBQyxRQUFILENBQVksR0FBWixHQUFrQixDQUFyQixFQUF3QixFQUFFLENB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T0FBVCxHQUFtQixLQUFuQjtBQUNELFdBUkgsV0FTUyxVQVRUO0FBVUQsU0F2Rk07QUF3RlAsUUFBQSxTQXhGTyxxQkF3RkcsQ0F4RkgsRUF3Rk07QUFDWCxVQUFBLGFBQWEsd0lBQWIsQ0FDRyxJQURILENBQ1EsWUFBTTtBQUNWLGdCQUFHLE1BQU0sQ0FBQyxRQUFQLElBQW1CLE1BQU0sQ0FBQyxRQUFQLENBQWdCLGFBQXRDLEVBQXFEO0FBQ25ELGNBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsYUFBaEIsR0FBZ0MsS0FBaEM7QUFDRDs7QUFDRCxZQUFBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLElBQWhCLG1DQUFnRCxDQUFDLENBQUMsR0FBbEQ7QUFDRCxXQU5ILFdBT1MsVUFQVDtBQVFELFNBakdNO0FBa0dQLFFBQUEsT0FsR08scUJBa0dHO0FBQ1IsZUFBSyxTQUFMLENBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULENBQWdCLElBQS9CO0FBQ0QsU0FwR007QUFxR1AsUUFBQSxJQXJHTyxnQkFxR0YsUUFyR0UsRUFxR1E7QUFDYixVQUFBLElBQUksQ0FBQyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsZUFBSyxPQUFMO0FBQ0EsZUFBSyxTQUFMO0FBQ0QsU0F6R007QUEwR1AsUUFBQSxLQTFHTyxtQkEwR0M7QUFDTixVQUFBLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBVDtBQUNEO0FBNUdNO0FBVFEsS0FBUixDQUFYO0FBd0hBLElBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQXJCO0FBQ0EsSUFBQSxJQUFJLENBQUMsS0FBTCxHQUFhLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBdEI7QUFDRDs7QUE5SEg7QUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIk5LQy5tb2R1bGVzLlNlbGVjdERyYWZ0ID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLmRvbSA9ICQoXCIjbW9kdWxlU2VsZWN0RHJhZnRcIik7XHJcbiAgICBzZWxmLmFwcCA9IG5ldyBWdWUoe1xyXG4gICAgICBlbDogXCIjbW9kdWxlU2VsZWN0RHJhZnRBcHBcIixcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHVpZDogTktDLmNvbmZpZ3MudWlkLFxyXG4gICAgICAgIHBhZ2luZzoge30sXHJcbiAgICAgICAgcGVycGFnZTogNyxcclxuICAgICAgICBsb2FkaW5nOiB0cnVlLFxyXG4gICAgICAgIGRyYWZ0czogW11cclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kczoge1xyXG4gICAgICAgIGZyb21Ob3c6IE5LQy5tZXRob2RzLmZyb21Ob3csXHJcbiAgICAgICAgaW5pdERvbSgpIHtcclxuICAgICAgICAgIGNvbnN0IGhlaWdodCA9IFwiNDMuNXJlbVwiO1xyXG4gICAgICAgICAgc2VsZi5kb20uY3NzKHtcclxuICAgICAgICAgICAgaGVpZ2h0XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHNlbGYuZG9tLmRyYWdnYWJsZSh7XHJcbiAgICAgICAgICAgIHNjcm9sbDogZmFsc2UsXHJcbiAgICAgICAgICAgIGhhbmRsZTogXCIubW9kdWxlLXNkLXRpdGxlXCIsXHJcbiAgICAgICAgICAgIGRyYWc6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgIGlmKHVpLnBvc2l0aW9uLnRvcCA8IDApIHVpLnBvc2l0aW9uLnRvcCA9IDA7XHJcbiAgICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgIGlmKHVpLnBvc2l0aW9uLnRvcCA+IGhlaWdodCAtIDMwKSB1aS5wb3NpdGlvbi50b3AgPSBoZWlnaHQgLSAzMDtcclxuICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IHNlbGYuZG9tLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgaWYodWkucG9zaXRpb24ubGVmdCA8IDEwMCAtIHdpZHRoKSB1aS5wb3NpdGlvbi5sZWZ0ID0gMTAwIC0gd2lkdGg7XHJcbiAgICAgICAgICAgICAgY29uc3Qgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgICBpZih1aS5wb3NpdGlvbi5sZWZ0ID4gd2luV2lkdGggLSAxMDApIHVpLnBvc2l0aW9uLmxlZnQgPSB3aW5XaWR0aCAtIDEwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjb25zdCB3aWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgaWYod2lkdGggPCA3MDApIHtcclxuICAgICAgICAgICAgLy8g5bCP5bGP5bmVXHJcbiAgICAgICAgICAgIHNlbGYuZG9tLmNzcyh7XHJcbiAgICAgICAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aCAqIDAuOCxcclxuICAgICAgICAgICAgICBcInRvcFwiOiAwLFxyXG4gICAgICAgICAgICAgIFwicmlnaHRcIjogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIOWuveWxj1xyXG4gICAgICAgICAgICBzZWxmLmRvbS5jc3MoXCJsZWZ0XCIsICh3aWR0aCAtIHNlbGYuZG9tLndpZHRoKCkpKjAuNSAtIDIwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlbGYuZG9tLnNob3coKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldERyYWZ0SW5mbyhkcmFmdCkge1xyXG4gICAgICAgICAgY29uc3Qge3R5cGUsIHRocmVhZCwgZm9ydW19ID0gZHJhZnQ7XHJcbiAgICAgICAgICBsZXQgaW5mbyA9IFwiXCI7XHJcbiAgICAgICAgICBpZih0eXBlID09PSBcIm5ld1RocmVhZFwiKSB7XHJcbiAgICAgICAgICAgIGluZm8gPSBg5Y+R6KGo5paH56ugYDtcclxuICAgICAgICAgIH0gZWxzZSBpZih0eXBlID09PSBcIm5ld1Bvc3RcIikge1xyXG4gICAgICAgICAgICBpbmZvID0gYOWcqOaWh+eroOOAiiR7dGhyZWFkLnRpdGxlfeOAi+S4i+WPkeihqOWbnuWkjWA7XHJcbiAgICAgICAgICB9IGVsc2UgaWYodHlwZSA9PT0gXCJtb2RpZnlQb3N0XCIpIHtcclxuICAgICAgICAgICAgaW5mbyA9IGDkv67mlLnmlofnq6DjgIoke3RocmVhZC50aXRsZX3jgIvkuIvnmoTlm57lpI1gO1xyXG4gICAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT09IFwibW9kaWZ5VGhyZWFkXCIpIHtcclxuICAgICAgICAgICAgaW5mbyA9IGDkv67mlLnmlofnq6DjgIoke3RocmVhZC50aXRsZX3jgItgO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5mbyA9IGDkv67mlLnkuJPkuJrjgIoke2ZvcnVtLnRpdGxlfeOAi+eahOS4k+S4muivtOaYjmA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gaW5mbztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluc2VydChkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgY29udGVudCA9IE5LQy5tZXRob2RzLnVlZGl0b3Iuc2V0Q29udGVudChkYXRhLmNvbnRlbnQpO1xyXG4gICAgICAgICAgc2VsZi5jYWxsYmFjayh7Y29udGVudDpjb250ZW50fSk7XHJcbiAgICAgICAgICBkYXRhLmRlbGF5ID0gMztcclxuICAgICAgICAgIGNvbnN0IGZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGRhdGEuZGVsYXkgLS07XHJcbiAgICAgICAgICAgICAgaWYoZGF0YS5kZWxheSA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlRHJhZnQoZHJhZnQpIHtcclxuICAgICAgICAgIHN3ZWV0UXVlc3Rpb24oXCLnoa7lrpropoHliKDpmaTojYnnqL/lkJfvvJ9cIilcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgIG5rY0FQSSgnL3UvJyArIHRoaXMudWlkICsgXCIvZHJhZnRzL1wiICsgZHJhZnQuZGlkLCBcIkRFTEVURVwiKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgIHNlbGYuYXBwLmdldERyYWZ0cyhzZWxmLmFwcC5wYWdpbmcucGFnZSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgc3dlZXRFcnJvcihkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXREcmFmdHMocGFnZSA9IDApIHtcclxuICAgICAgICAgIG5rY0FQSShgL3UvJHt0aGlzLnVpZH0vcHJvZmlsZS9kcmFmdD9wYWdlPSR7cGFnZX0mcGVycGFnZT0ke3RoaXMucGVycGFnZX1gLCBcIkdFVFwiKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICBkYXRhLmRyYWZ0cy5tYXAoZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBkLmRlbGF5ID0gMDtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBzZWxmLmFwcC5kcmFmdHMgPSBkYXRhLmRyYWZ0cztcclxuICAgICAgICAgICAgICBzZWxmLmFwcC5wYWdpbmcgPSBkYXRhLnBhZ2luZztcclxuICAgICAgICAgICAgICBzZWxmLmFwcC5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvYWREcmFmdChkKSB7XHJcbiAgICAgICAgICBzd2VldFF1ZXN0aW9uKGDnu6fnu63liJvkvZzlsIbkvJropobnm5bnvJbovpHlmajkuK3lhajpg6jlhoXlrrnvvIznoa7lrprnu6fnu63vvJ9gKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYod2luZG93LlBvc3RJbmZvICYmIHdpbmRvdy5Qb3N0SW5mby5zaG93Q2xvc2VJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuUG9zdEluZm8uc2hvd0Nsb3NlSW5mbyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvZWRpdG9yP3R5cGU9cmVkaXQmaWQ9JHtkLmRpZH1gO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWZyZXNoKCkge1xyXG4gICAgICAgICAgdGhpcy5nZXREcmFmdHMoc2VsZi5hcHAucGFnaW5nLnBhZ2UpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3BlbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgc2VsZi5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgICAgdGhpcy5pbml0RG9tKCk7XHJcbiAgICAgICAgICB0aGlzLmdldERyYWZ0cygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xvc2UoKSB7XHJcbiAgICAgICAgICBzZWxmLmRvbS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHNlbGYub3BlbiA9IHNlbGYuYXBwLm9wZW47XHJcbiAgICBzZWxmLmNsb3NlID0gc2VsZi5hcHAuY2xvc2U7XHJcbiAgfVxyXG59OyJdfQ==

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StickerViewer = function StickerViewer() {
  _classCallCheck(this, StickerViewer);

  var self = this;
  self.dom = $("#moduleStickerViewer");
  self.dom.modal({
    show: false
  });
  self.app = new Vue({
    el: "#moduleStickerViewerApp",
    data: {
      sticker: "",
      uid: NKC.configs.uid,
      management: false,
      loading: false
    },
    mounted: function mounted() {
      this.init();
    },
    methods: {
      getUrl: NKC.methods.tools.getUrl,
      fromNow: NKC.methods.fromNow,
      collection: function collection() {
        nkcAPI("/sticker", "POST", {
          type: "collection",
          stickersId: [this.sticker._id]
        }).then(function () {
          self.app.close();
          sweetSuccess("表情已添加");
        })["catch"](sweetError);
      },
      moveSticker: function moveSticker() {
        var sticker = this.sticker;
        var body = {
          type: "move",
          stickersId: [sticker.collected._id]
        };
        nkcAPI("/sticker", "POST", body).then(function () {
          self.app.close();
          window.location.reload();
        })["catch"](sweetError);
      },
      shareSticker: function shareSticker() {
        var sticker = this.sticker;
        var body = {
          type: "share",
          stickersId: [sticker._id]
        };
        nkcAPI("/sticker", "POST", body).then(function () {
          sweetSuccess("操作成功");
        })["catch"](sweetError);
      },
      removeSticker: function removeSticker() {
        var sticker = this.sticker;
        sweetQuestion("\u786E\u5B9A\u8981\u5220\u9664\u8868\u60C5\uFF1F").then(function () {
          var body = {
            type: "delete",
            stickersId: [sticker.collected._id]
          };
          return nkcAPI("/sticker", "POST", body);
        }).then(function () {
          self.app.close();
          window.location.reload();
        })["catch"](sweetError);
      },
      init: function init() {
        var dom = $("[data-sticker-rid]");

        for (var i = 0; i < dom.length; i++) {
          var d = dom.eq(i);
          if (d.attr("data-sticker-init") === "true") continue;
          d.on("click", function () {
            self.app.open($(this).attr("data-sticker-rid"), !!$(this).attr("data-sticker-management"));
          });
          d.attr("data-sticker-init", "true");
        }
      },
      open: function open(rid, management) {
        self.app.management = !!management;
        self.dom.modal("show");
        this.loading = true;
        nkcAPI("/sticker/".concat(rid, "?t=json"), "GET").then(function (data) {
          self.app.sticker = data.sticker;
          self.app.loading = false;
        })["catch"](sweetError);
      },
      close: function close() {
        self.dom.modal("hide");
      }
    }
  });
  self.initPanel = self.app.init;
};

var stickerViewer = new StickerViewer();
NKC.methods.initStickerViewer = stickerViewer.app.init;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL3B1YmxpY01vZHVsZXMvc3RpY2tlci9zdGlja2VyLm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7SUNBTSxhLEdBQ0oseUJBQWM7QUFBQTs7QUFDWixNQUFNLElBQUksR0FBRyxJQUFiO0FBQ0EsRUFBQSxJQUFJLENBQUMsR0FBTCxHQUFXLENBQUMsQ0FBQyxzQkFBRCxDQUFaO0FBQ0EsRUFBQSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBZTtBQUNiLElBQUEsSUFBSSxFQUFFO0FBRE8sR0FBZjtBQUdBLEVBQUEsSUFBSSxDQUFDLEdBQUwsR0FBVyxJQUFJLEdBQUosQ0FBUTtBQUNqQixJQUFBLEVBQUUsRUFBRSx5QkFEYTtBQUVqQixJQUFBLElBQUksRUFBRTtBQUNKLE1BQUEsT0FBTyxFQUFFLEVBREw7QUFFSixNQUFBLEdBQUcsRUFBRSxHQUFHLENBQUMsT0FBSixDQUFZLEdBRmI7QUFHSixNQUFBLFVBQVUsRUFBRSxLQUhSO0FBSUosTUFBQSxPQUFPLEVBQUU7QUFKTCxLQUZXO0FBUWpCLElBQUEsT0FSaUIscUJBUVA7QUFDUixXQUFLLElBQUw7QUFDRCxLQVZnQjtBQVdqQixJQUFBLE9BQU8sRUFBRTtBQUNQLE1BQUEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBWixDQUFrQixNQURuQjtBQUVQLE1BQUEsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksT0FGZDtBQUdQLE1BQUEsVUFITyx3QkFHTTtBQUNYLFFBQUEsTUFBTSxhQUFhLE1BQWIsRUFBcUI7QUFDekIsVUFBQSxJQUFJLEVBQUUsWUFEbUI7QUFFekIsVUFBQSxVQUFVLEVBQUUsQ0FBQyxLQUFLLE9BQUwsQ0FBYSxHQUFkO0FBRmEsU0FBckIsQ0FBTixDQUlHLElBSkgsQ0FJUSxZQUFXO0FBQ2YsVUFBQSxJQUFJLENBQUMs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QUFBLE1BQU0sb0JBQWEsR0FBYixjQUEyQixLQUEzQixDQUFOLENBQ0csSUFESCxDQUNRLFVBQUEsSUFBSSxFQUFJO0FBQ1osVUFBQSxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQVQsR0FBbUIsSUFBSSxDQUFDLE9BQXhCO0FBQ0EsVUFBQSxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQVQsR0FBbUIsS0FBbkI7QUFDRCxTQUpILFdBS1MsVUFMVDtBQU1ELE9BNUVNO0FBNkVQLE1BQUEsS0E3RU8sbUJBNkVDO0FBQ04sUUFBQSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBZSxNQUFmO0FBQ0Q7QUEvRU07QUFYUSxHQUFSLENBQVg7QUE2RkEsRUFBQSxJQUFJLENBQUMsU0FBTCxHQUFpQixJQUFJLENBQUMsR0FBTCxDQUFTLElBQTFCO0FBQ0QsQzs7QUFFSCxJQUFNLGFBQWEsR0FBRyxJQUFJLGFBQUosRUFBdEI7QUFDQSxHQUFHLENBQUMsT0FBSixDQUFZLGlCQUFaLEdBQWdDLGFBQWEsQ0FBQyxHQUFkLENBQWtCLElBQWxEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3MgU3RpY2tlclZpZXdlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIHNlbGYuZG9tID0gJChcIiNtb2R1bGVTdGlja2VyVmlld2VyXCIpO1xyXG4gICAgc2VsZi5kb20ubW9kYWwoe1xyXG4gICAgICBzaG93OiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBzZWxmLmFwcCA9IG5ldyBWdWUoe1xyXG4gICAgICBlbDogXCIjbW9kdWxlU3RpY2tlclZpZXdlckFwcFwiLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgc3RpY2tlcjogXCJcIixcclxuICAgICAgICB1aWQ6IE5LQy5jb25maWdzLnVpZCxcclxuICAgICAgICBtYW5hZ2VtZW50OiBmYWxzZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBtb3VudGVkKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgZ2V0VXJsOiBOS0MubWV0aG9kcy50b29scy5nZXRVcmwsXHJcbiAgICAgICAgZnJvbU5vdzogTktDLm1ldGhvZHMuZnJvbU5vdyxcclxuICAgICAgICBjb2xsZWN0aW9uKCkge1xyXG4gICAgICAgICAgbmtjQVBJKGAvc3RpY2tlcmAsIFwiUE9TVFwiLCB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY29sbGVjdGlvblwiLFxyXG4gICAgICAgICAgICBzdGlja2Vyc0lkOiBbdGhpcy5zdGlja2VyLl9pZF1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHNlbGYuYXBwLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgc3dlZXRTdWNjZXNzKFwi6KGo5oOF5bey5re75YqgXCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtb3ZlU3RpY2tlcigpIHtcclxuICAgICAgICAgIGNvbnN0IHtzdGlja2VyfSA9IHRoaXM7XHJcbiAgICAgICAgICBjb25zdCBib2R5ID0ge1xyXG4gICAgICAgICAgICB0eXBlOiBcIm1vdmVcIixcclxuICAgICAgICAgICAgc3RpY2tlcnNJZDogW3N0aWNrZXIuY29sbGVjdGVkLl9pZF1cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBua2NBUEkoXCIvc3RpY2tlclwiLCBcIlBPU1RcIiwgYm9keSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHNlbGYuYXBwLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaGFyZVN0aWNrZXIoKSB7XHJcbiAgICAgICAgICBjb25zdCB7c3RpY2tlcn0gPSB0aGlzO1xyXG4gICAgICAgICAgY29uc3QgYm9keSA9IHtcclxuICAgICAgICAgICAgdHlwZTogXCJzaGFyZVwiLFxyXG4gICAgICAgICAgICBzdGlja2Vyc0lkOiBbc3RpY2tlci5faWRdXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgbmtjQVBJKFwiL3N0aWNrZXJcIiwgXCJQT1NUXCIsIGJvZHkpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBzd2VldFN1Y2Nlc3MoXCLmk43kvZzmiJDlip9cIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZVN0aWNrZXIoKSB7XHJcbiAgICAgICAgICBjb25zdCB7c3RpY2tlcn0gPSB0aGlzO1xyXG4gICAgICAgICAgc3dlZXRRdWVzdGlvbihg56Gu5a6a6KaB5Yig6Zmk6KGo5oOF77yfYClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRlbGV0ZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RpY2tlcnNJZDogW3N0aWNrZXIuY29sbGVjdGVkLl9pZF1cclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIHJldHVybiBua2NBUEkoXCIvc3RpY2tlclwiLCBcIlBPU1RcIiwgYm9keSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBzZWxmLmFwcC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdCgpIHtcclxuICAgICAgICAgIGNvbnN0IGRvbSA9ICQoXCJbZGF0YS1zdGlja2VyLXJpZF1cIik7XHJcbiAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZG9tLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGQgPSBkb20uZXEoaSk7XHJcbiAgICAgICAgICAgIGlmKGQuYXR0cihcImRhdGEtc3RpY2tlci1pbml0XCIpID09PSBcInRydWVcIikgY29udGludWU7XHJcbiAgICAgICAgICAgIGQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBzZWxmLmFwcC5vcGVuKCQodGhpcykuYXR0cihcImRhdGEtc3RpY2tlci1yaWRcIiksICEhJCh0aGlzKS5hdHRyKFwiZGF0YS1zdGlja2VyLW1hbmFnZW1lbnRcIikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZC5hdHRyKFwiZGF0YS1zdGlja2VyLWluaXRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3BlbihyaWQsIG1hbmFnZW1lbnQpIHtcclxuICAgICAgICAgIHNlbGYuYXBwLm1hbmFnZW1lbnQgPSAhIW1hbmFnZW1lbnQ7XHJcbiAgICAgICAgICBzZWxmLmRvbS5tb2RhbChcInNob3dcIik7XHJcbiAgICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgbmtjQVBJKGAvc3RpY2tlci8ke3JpZH0/dD1qc29uYCwgXCJHRVRcIilcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgc2VsZi5hcHAuc3RpY2tlciA9IGRhdGEuc3RpY2tlcjtcclxuICAgICAgICAgICAgICBzZWxmLmFwcC5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3NlKCkge1xyXG4gICAgICAgICAgc2VsZi5kb20ubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBzZWxmLmluaXRQYW5lbCA9IHNlbGYuYXBwLmluaXQ7XHJcbiAgfVxyXG59XHJcbmNvbnN0IHN0aWNrZXJWaWV3ZXIgPSBuZXcgU3RpY2tlclZpZXdlcigpO1xyXG5OS0MubWV0aG9kcy5pbml0U3RpY2tlclZpZXdlciA9IHN0aWNrZXJWaWV3ZXIuYXBwLmluaXQ7XHJcbiJdfQ==

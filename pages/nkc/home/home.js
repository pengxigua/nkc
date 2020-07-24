(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = NKC.methods.getDataById("data");

var modifyAd = function modifyAd(ad, type) {
  ad.type = type;
};

for (var i = 0; i < data.ads.movable.length; i++) {
  var ad = data.ads.movable[i];
  modifyAd(ad, "movable");
}

for (var _i = 0; _i < data.ads.fixed.length; _i++) {
  var _ad = data.ads.fixed[_i];
  modifyAd(_ad, "fixed");
}

console.log(data);
var app = new Vue({
  el: "#app",
  data: {
    page: {
      id: 'movable',
      name: '轮播图'
    },
    recommendThreads: data.recommendThreads,
    ads: data.ads,
    recommendForums: data.recommendForums,
    columns: data.columns,
    goods: data.goods,
    toppedThreads: data.toppedThreads,
    showShopGoods: data.showGoods ? "t" : "",
    // 首页“最新原创”文章条目显示模式，为空就默认为简略显示
    originalThreadDisplayMode: data.originalThreadDisplayMode,
    updating: false
  },
  mounted: function mounted() {
    window.SelectImage = new NKC.methods.selectImage();
    window.MoveThread = new NKC.modules.MoveThread();
  },
  computed: {
    selectedRecommendForumsId: function selectedRecommendForumsId() {
      return data.recommendForums.map(function (f) {
        return f.fid;
      });
    },
    nav: function nav() {
      var page = this.page;
      var arr = [{
        id: 'other',
        name: '其他'
      }, {
        id: 'movable',
        name: '轮播图'
      }, {
        id: 'fixed',
        name: '固定图'
      }];
      arr.map(function (a) {
        a.active = a.id === page.id;
      });
      return arr;
    }
  },
  methods: {
    checkString: NKC.methods.checkData.checkString,
    checkNumber: NKC.methods.checkData.checkNumber,
    getUrl: NKC.methods.tools.getUrl,
    floatUserInfo: NKC.methods.tools.floatUserInfo,
    visitUrl: NKC.methods.visitUrl,
    removeFromArr: function removeFromArr(arr, index) {
      arr.splice(index, 1);
    },
    moveFromArr: function moveFromArr(arr, index, type) {
      var count = arr.length;
      if (index === 0 && type === 'left') return;
      if (index + 1 === count && type === 'right') return;

      var _index;

      if (type === 'left') {
        _index = index - 1;
      } else {
        _index = index + 1;
      }

      var item = arr[index];
      var _item = arr[_index];
      Vue.set(arr, index, _item);
      Vue.set(arr, _index, item);
    },
    getRecommendTypeName: function getRecommendTypeName(id) {
      return {
        movable: '轮播图',
        fixed: '固定图'
      }[id];
    },
    selectPage: function selectPage(page) {
      this.page = page;
    },
    saveRecommendThreads: function saveRecommendThreads() {
      var page = this.page;
      var options = this.recommendThreads[page.id];
      nkcAPI("/nkc/home", 'PATCH', {
        operation: 'saveRecommendThreads',
        type: page.id,
        options: options
      }).then(function () {
        sweetSuccess('保存成功');
      })["catch"](sweetError);
    },
    updateThreadList: function updateThreadList() {
      var page = this.page;
      this.updating = true;
      var pageId = page.id;
      var self = this;
      nkcAPI('/nkc/home', 'PATCH', {
        operation: 'updateThreadList',
        type: pageId
      }).then(function (data) {
        self.recommendThreads[pageId].automaticallySelectedThreads = data.automaticallySelectedThreads;
        Vue.set(self.saveRecommendThreads);
        sweetSuccess('更新成功');
        self.updating = false;
      })["catch"](function (err) {
        self.updating = false;
      });
    },
    selectLocalFile: function selectLocalFile(ad) {
      var options = {};

      if (ad.type === "movable") {
        options.aspectRatio = 800 / 336;
      } else {
        options.aspectRatio = 400 / 253;
      }

      SelectImage.show(function (data) {
        var formData = new FormData();
        formData.append("cover", data);
        formData.append("topType", ad.type);
        formData.append("tid", ad.tid);
        nkcUploadFile("/nkc/home", "POST", formData).then(function (data) {
          ad.cover = data.coverHash;
        })["catch"](sweetError);
        SelectImage.close();
      }, options);
    },
    move: function move(ad, type) {
      var ads;

      if (ad.type === "movable") {
        ads = this.ads.movable;
      } else {
        ads = this.ads.fixed;
      }

      var index = ads.indexOf(ad);
      if (type === "left" && index === 0 || type === "right" && index + 1 === ads.length) return;
      var newIndex;

      if (type === "left") {
        newIndex = index - 1;
      } else {
        newIndex = index + 1;
      }

      var otherAd = ads[newIndex];
      ads.splice(index, 1, otherAd);
      ads.splice(newIndex, 1, ad);
    },
    saveAds: function saveAds() {
      var _this$ads = this.ads,
          movable = _this$ads.movable,
          fixed = _this$ads.fixed,
          movableOrder = _this$ads.movableOrder,
          fixedOrder = _this$ads.fixedOrder;
      var self = this;
      Promise.resolve().then(function () {
        movable.concat(fixed).map(function (ad) {
          self.checkString(ad.title, {
            name: "标题",
            minLength: 1,
            maxLength: 200
          });
          if (!ad.cover) throw "封面图不能为空";
          if (!ad.tid) throw "文章ID不能为空";
        });
        return nkcAPI("/nkc/home", "PUT", {
          operation: "saveAds",
          movable: movable,
          fixed: fixed,
          movableOrder: movableOrder,
          fixedOrder: fixedOrder
        });
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    remove: function remove(ads, index) {
      ads.splice(index, 1);
      /*sweetQuestion("确定要执行删除操作？")
        .then(() => {
          ads.splice(index, 1)
        })
        .catch(() => {})*/
    },
    addForum: function addForum() {
      var self = this;
      MoveThread.open(function (data) {
        var originForums = data.originForums;
        originForums.map(function (forum) {
          if (!self.selectedRecommendForumsId.includes(forum.fid)) {
            self.recommendForums.push(forum);
          }
        });
        MoveThread.close();
      }, {
        hideMoveType: true
      });
    },
    moveForum: function moveForum(arr, f, type) {
      var index = arr.indexOf(f);
      if (type === "left" && index === 0 || type === "right" && index + 1 === arr.length) return;
      var newIndex;

      if (type === "left") {
        newIndex = index - 1;
      } else {
        newIndex = index + 1;
      }

      var otherAd = arr[newIndex];
      arr.splice(index, 1, otherAd);
      arr.splice(newIndex, 1, f);
    },
    removeForum: function removeForum(arr, index) {
      arr.splice(index, 1);
      /*const self = this;
      sweetQuestion("确定要执行删除操作？")
        .then(() => {
          arr.splice(index, 1);
        })
        .catch(() => {})*/
    },
    saveRecommendForums: function saveRecommendForums() {
      var forumsId = this.recommendForums.map(function (forum) {
        return forum.fid;
      });
      nkcAPI("/nkc/home", "PUT", {
        operation: "saveRecommendForums",
        forumsId: forumsId
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    saveColumns: function saveColumns() {
      var columnsId = this.columns.map(function (c) {
        return c._id;
      });
      nkcAPI("/nkc/home", "PUT", {
        operation: "saveColumns",
        columnsId: columnsId
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    saveGoods: function saveGoods() {
      var goodsId = this.goods.map(function (g) {
        return g.productId;
      });
      var showShopGoods = !!this.showShopGoods;
      nkcAPI("/nkc/home", "PUT", {
        operation: "saveGoods",
        goodsId: goodsId,
        showShopGoods: showShopGoods
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    saveToppedThreads: function saveToppedThreads() {
      var toppedThreadsId = this.toppedThreads.map(function (t) {
        return t.tid;
      });
      nkcAPI("/nkc/home", "PUT", {
        operation: "saveToppedThreads",
        toppedThreadsId: toppedThreadsId
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    saveOriginalThreadDisplayMode: function saveOriginalThreadDisplayMode() {
      var originalThreadDisplayMode = this.originalThreadDisplayMode;
      nkcAPI("/nkc/home", "PATCH", {
        operation: "saveOriginalThreadDisplayMode",
        originalThreadDisplayMode: originalThreadDisplayMode
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL25rYy9ob21lL2hvbWUubWpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsT0FBSixDQUFZLFdBQVosQ0FBd0IsTUFBeEIsQ0FBYjs7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVcsQ0FBQyxFQUFELEVBQUssSUFBTCxFQUFjO0FBQzdCLEVBQUEsRUFBRSxDQUFDLElBQUgsR0FBVSxJQUFWO0FBQ0QsQ0FGRDs7QUFJQSxLQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFULENBQWlCLE1BQXBDLEVBQTRDLENBQUMsRUFBN0MsRUFBaUQ7QUFDL0MsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFULENBQWlCLENBQWpCLENBQVg7QUFDQSxFQUFBLFFBQVEsQ0FBQyxFQUFELEVBQUssU0FBTCxDQUFSO0FBQ0Q7O0FBRUQsS0FBSSxJQUFJLEVBQUMsR0FBRyxDQUFaLEVBQWUsRUFBQyxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFlLE1BQWxDLEVBQTBDLEVBQUMsRUFBM0MsRUFBK0M7QUFDN0MsTUFBTSxHQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQWUsRUFBZixDQUFYO0FBQ0EsRUFBQSxRQUFRLENBQUMsR0FBRCxFQUFLLE9BQUwsQ0FBUjtBQUNEOztBQUVELE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWjtBQUVBLElBQU0sR0FBRyxHQUFHLElBQUksR0FBSixDQUFRO0FBQ2xCLEVBQUEsRUFBRSxFQUFFLE1BRGM7QUFFbEIsRUFBQSxJQUFJLEVBQUU7QUFDSixJQUFBLElBQUksRUFBRTtBQUFDLE1BQUEsRUFBRSxFQUFFLFNBQUw7QUFBZ0IsTUFBQSxJ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Y2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGRhdGEgPSBOS0MubWV0aG9kcy5nZXREYXRhQnlJZChcImRhdGFcIik7XHJcbmNvbnN0IG1vZGlmeUFkID0gKGFkLCB0eXBlKSA9PiB7XHJcbiAgYWQudHlwZSA9IHR5cGU7XHJcbn07XHJcblxyXG5mb3IobGV0IGkgPSAwOyBpIDwgZGF0YS5hZHMubW92YWJsZS5sZW5ndGg7IGkrKykge1xyXG4gIGNvbnN0IGFkID0gZGF0YS5hZHMubW92YWJsZVtpXTtcclxuICBtb2RpZnlBZChhZCwgXCJtb3ZhYmxlXCIpO1xyXG59XHJcblxyXG5mb3IobGV0IGkgPSAwOyBpIDwgZGF0YS5hZHMuZml4ZWQubGVuZ3RoOyBpKyspIHtcclxuICBjb25zdCBhZCA9IGRhdGEuYWRzLmZpeGVkW2ldO1xyXG4gIG1vZGlmeUFkKGFkLCBcImZpeGVkXCIpO1xyXG59XHJcblxyXG5jb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBWdWUoe1xyXG4gIGVsOiBcIiNhcHBcIixcclxuICBkYXRhOiB7XHJcbiAgICBwYWdlOiB7aWQ6ICdtb3ZhYmxlJywgbmFtZTogJ+i9ruaSreWbvid9LFxyXG4gICAgcmVjb21tZW5kVGhyZWFkczogZGF0YS5yZWNvbW1lbmRUaHJlYWRzLFxyXG4gICAgYWRzOiBkYXRhLmFkcyxcclxuICAgIHJlY29tbWVuZEZvcnVtczogZGF0YS5yZWNvbW1lbmRGb3J1bXMsXHJcbiAgICBjb2x1bW5zOiBkYXRhLmNvbHVtbnMsXHJcbiAgICBnb29kczogZGF0YS5nb29kcyxcclxuICAgIHRvcHBlZFRocmVhZHM6IGRhdGEudG9wcGVkVGhyZWFkcyxcclxuICAgIHNob3dTaG9wR29vZHM6IChkYXRhLnNob3dHb29kcz8gXCJ0XCI6IFwiXCIpLFxyXG4gICAgLy8g6aaW6aG14oCc5pyA5paw5Y6f5Yib4oCd5paH56ug5p2h55uu5pi+56S65qih5byP77yM5Li656m65bCx6buY6K6k5Li6566A55Wl5pi+56S6XHJcbiAgICBvcmlnaW5hbFRocmVhZERpc3BsYXlNb2RlOiBkYXRhLm9yaWdpbmFsVGhyZWFkRGlzcGxheU1vZGUsXHJcblxyXG4gICAgdXBkYXRpbmc6IGZhbHNlLFxyXG4gIH0sXHJcbiAgbW91bnRlZCgpIHtcclxuICAgIHdpbmRvdy5TZWxlY3RJbWFnZSA9IG5ldyBOS0MubWV0aG9kcy5zZWxlY3RJbWFnZSgpO1xyXG4gICAgd2luZG93Lk1vdmVUaHJlYWQgPSBuZXcgTktDLm1vZHVsZXMuTW92ZVRocmVhZCgpO1xyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIHNlbGVjdGVkUmVjb21tZW5kRm9ydW1zSWQoKSB7XHJcbiAgICAgIHJldHVybiBkYXRhLnJlY29tbWVuZEZvcnVtcy5tYXAoZiA9PiBmLmZpZCk7XHJcbiAgICB9LFxyXG4gICAgbmF2KCkge1xyXG4gICAgICBjb25zdCB7cGFnZX0gPSB0aGlzO1xyXG4gICAgICBjb25zdCBhcnIgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdvdGhlcicsXHJcbiAgICAgICAgICBuYW1lOiAn5YW25LuWJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdtb3ZhYmxlJyxcclxuICAgICAgICAgIG5hbWU6ICfova7mkq3lm74nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2ZpeGVkJyxcclxuICAgICAgICAgIG5hbWU6ICflm7rlrprlm74nXHJcbiAgICAgICAgfVxyXG4gICAgICBdO1xyXG4gICAgICBhcnIubWFwKGEgPT4ge1xyXG4gICAgICAgIGEuYWN0aXZlID0gYS5pZCA9PT0gcGFnZS5pZDtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBjaGVja1N0cmluZzogTktDLm1ldGhvZHMuY2hlY2tEYXRhLmNoZWNrU3RyaW5nLFxyXG4gICAgY2hlY2tOdW1iZXI6IE5LQy5tZXRob2RzLmNoZWNrRGF0YS5jaGVja051bWJlcixcclxuICAgIGdldFVybDogTktDLm1ldGhvZHMudG9vbHMuZ2V0VXJsLFxyXG4gICAgZmxvYXRVc2VySW5mbzogTktDLm1ldGhvZHMudG9vbHMuZmxvYXRVc2VySW5mbyxcclxuICAgIHZpc2l0VXJsOiBOS0MubWV0aG9kcy52aXNpdFVybCxcclxuICAgIHJlbW92ZUZyb21BcnIoYXJyLCBpbmRleCkge1xyXG4gICAgICBhcnIuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH0sXHJcbiAgICBtb3ZlRnJvbUFycihhcnIsIGluZGV4LCB0eXBlKSB7XHJcbiAgICAgIGNvbnN0IGNvdW50ID0gYXJyLmxlbmd0aDtcclxuICAgICAgaWYoaW5kZXggPT09IDAgJiYgdHlwZSA9PT0gJ2xlZnQnKSByZXR1cm47XHJcbiAgICAgIGlmKGluZGV4ICsgMSA9PT0gY291bnQgJiYgdHlwZSA9PT0gJ3JpZ2h0JykgcmV0dXJuO1xyXG4gICAgICBsZXQgX2luZGV4O1xyXG4gICAgICBpZih0eXBlID09PSAnbGVmdCcpIHtcclxuICAgICAgICBfaW5kZXggPSBpbmRleCAtIDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgX2luZGV4ID0gaW5kZXggKyAxO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSBhcnJbaW5kZXhdO1xyXG4gICAgICBjb25zdCBfaXRlbSA9IGFycltfaW5kZXhdO1xyXG4gICAgICBWdWUuc2V0KGFyciwgaW5kZXgsIF9pdGVtKTtcclxuICAgICAgVnVlLnNldChhcnIsIF9pbmRleCwgaXRlbSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0UmVjb21tZW5kVHlwZU5hbWUoaWQpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBtb3ZhYmxlOiAn6L2u5pKt5Zu+JyxcclxuICAgICAgICBmaXhlZDogJ+WbuuWumuWbvidcclxuICAgICAgfVtpZF1cclxuICAgIH0sXHJcbiAgICBzZWxlY3RQYWdlKHBhZ2UpIHtcclxuICAgICAgdGhpcy5wYWdlID0gcGFnZTtcclxuICAgIH0sXHJcbiAgICBzYXZlUmVjb21tZW5kVGhyZWFkcygpIHtcclxuICAgICAgY29uc3Qge3BhZ2V9ID0gdGhpcztcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucmVjb21tZW5kVGhyZWFkc1twYWdlLmlkXTtcclxuICAgICAgbmtjQVBJKGAvbmtjL2hvbWVgLCAnUEFUQ0gnLCB7XHJcbiAgICAgICAgb3BlcmF0aW9uOiAnc2F2ZVJlY29tbWVuZFRocmVhZHMnLFxyXG4gICAgICAgIHR5cGU6IHBhZ2UuaWQsXHJcbiAgICAgICAgb3B0aW9uc1xyXG4gICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHN3ZWV0U3VjY2Vzcygn5L+d5a2Y5oiQ5YqfJyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlVGhyZWFkTGlzdCgpIHtcclxuICAgICAgY29uc3Qge3BhZ2V9ID0gdGhpcztcclxuICAgICAgdGhpcy51cGRhdGluZyA9IHRydWU7XHJcbiAgICAgIGNvbnN0IHBhZ2VJZCA9IHBhZ2UuaWQ7XHJcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICBua2NBUEkoJy9ua2MvaG9tZScsICdQQVRDSCcsIHtcclxuICAgICAgICBvcGVyYXRpb246ICd1cGRhdGVUaHJlYWRMaXN0JyxcclxuICAgICAgICB0eXBlOiBwYWdlSWRcclxuICAgICAgfSlcclxuICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgIHNlbGYucmVjb21tZW5kVGhyZWFkc1twYWdlSWRdLmF1dG9tYXRpY2FsbHlTZWxlY3RlZFRocmVhZHMgPSBkYXRhLmF1dG9tYXRpY2FsbHlTZWxlY3RlZFRocmVhZHM7XHJcbiAgICAgICAgICBWdWUuc2V0KHNlbGYuc2F2ZVJlY29tbWVuZFRocmVhZHMpO1xyXG4gICAgICAgICAgc3dlZXRTdWNjZXNzKCfmm7TmlrDmiJDlip8nKTtcclxuICAgICAgICAgIHNlbGYudXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgc2VsZi51cGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHNlbGVjdExvY2FsRmlsZShhZCkge1xyXG4gICAgICBjb25zdCBvcHRpb25zID0ge307XHJcbiAgICAgIGlmKGFkLnR5cGUgPT09IFwibW92YWJsZVwiKSB7XHJcbiAgICAgICAgb3B0aW9ucy5hc3BlY3RSYXRpbyA9IDgwMC8zMzY7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9ucy5hc3BlY3RSYXRpbyA9IDQwMC8yNTM7XHJcbiAgICAgIH1cclxuICAgICAgU2VsZWN0SW1hZ2Uuc2hvdyhkYXRhID0+IHtcclxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImNvdmVyXCIsIGRhdGEpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInRvcFR5cGVcIiwgYWQudHlwZSk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwidGlkXCIsIGFkLnRpZCk7XHJcbiAgICAgICAgbmtjVXBsb2FkRmlsZShcIi9ua2MvaG9tZVwiLCBcIlBPU1RcIiwgZm9ybURhdGEpXHJcbiAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgYWQuY292ZXIgPSBkYXRhLmNvdmVySGFzaDtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICAgICAgU2VsZWN0SW1hZ2UuY2xvc2UoKTtcclxuICAgICAgfSwgb3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgbW92ZShhZCwgdHlwZSkge1xyXG4gICAgICBsZXQgYWRzO1xyXG4gICAgICBpZihhZC50eXBlID09PSBcIm1vdmFibGVcIikge1xyXG4gICAgICAgIGFkcyA9IHRoaXMuYWRzLm1vdmFibGU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWRzID0gdGhpcy5hZHMuZml4ZWQ7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW5kZXggPSBhZHMuaW5kZXhPZihhZCk7XHJcbiAgICAgIGlmKCh0eXBlID09PSBcImxlZnRcIiAmJiBpbmRleCA9PT0gMCkgfHwgKHR5cGUgPT09IFwicmlnaHRcIiAmJiBpbmRleCsxID09PSBhZHMubGVuZ3RoKSkgcmV0dXJuO1xyXG4gICAgICBsZXQgbmV3SW5kZXg7XHJcbiAgICAgIGlmKHR5cGUgPT09IFwibGVmdFwiKSB7XHJcbiAgICAgICAgbmV3SW5kZXggPSBpbmRleCAtIDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3SW5kZXggPSBpbmRleCArIDE7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgb3RoZXJBZCA9IGFkc1tuZXdJbmRleF07XHJcbiAgICAgIGFkcy5zcGxpY2UoaW5kZXgsIDEsIG90aGVyQWQpO1xyXG4gICAgICBhZHMuc3BsaWNlKG5ld0luZGV4LCAxLCBhZCk7XHJcbiAgICB9LFxyXG4gICAgc2F2ZUFkcygpe1xyXG4gICAgICBjb25zdCB7bW92YWJsZSwgZml4ZWQsIG1vdmFibGVPcmRlciwgZml4ZWRPcmRlcn0gPSB0aGlzLmFkcztcclxuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgbW92YWJsZS5jb25jYXQoZml4ZWQpLm1hcChhZCA9PiB7XHJcbiAgICAgICAgICAgIHNlbGYuY2hlY2tTdHJpbmcoYWQudGl0bGUsIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIuagh+mimFwiLFxyXG4gICAgICAgICAgICAgIG1pbkxlbmd0aDogMSxcclxuICAgICAgICAgICAgICBtYXhMZW5ndGg6IDIwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYoIWFkLmNvdmVyKSB0aHJvdyBcIuWwgemdouWbvuS4jeiDveS4uuepulwiO1xyXG4gICAgICAgICAgICBpZighYWQudGlkKSB0aHJvdyBcIuaWh+eroElE5LiN6IO95Li656m6XCI7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybiBua2NBUEkoXCIvbmtjL2hvbWVcIiwgXCJQVVRcIiwge1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwic2F2ZUFkc1wiLFxyXG4gICAgICAgICAgICBtb3ZhYmxlLFxyXG4gICAgICAgICAgICBmaXhlZCxcclxuICAgICAgICAgICAgbW92YWJsZU9yZGVyLFxyXG4gICAgICAgICAgICBmaXhlZE9yZGVyXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHN3ZWV0U3VjY2VzcyhcIuS/neWtmOaIkOWKn1wiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICAgIH0sXHJcbiAgICByZW1vdmUoYWRzLCBpbmRleCl7XHJcbiAgICAgIGFkcy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgIC8qc3dlZXRRdWVzdGlvbihcIuehruWumuimgeaJp+ihjOWIoOmZpOaTjeS9nO+8n1wiKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGFkcy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKCkgPT4ge30pKi9cclxuXHJcbiAgICB9LFxyXG4gICAgYWRkRm9ydW0oKSB7XHJcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICBNb3ZlVGhyZWFkLm9wZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgY29uc3Qge29yaWdpbkZvcnVtc30gPSBkYXRhO1xyXG4gICAgICAgIG9yaWdpbkZvcnVtcy5tYXAoZm9ydW0gPT4ge1xyXG4gICAgICAgICAgaWYoIXNlbGYuc2VsZWN0ZWRSZWNvbW1lbmRGb3J1bXNJZC5pbmNsdWRlcyhmb3J1bS5maWQpKSB7XHJcbiAgICAgICAgICAgIHNlbGYucmVjb21tZW5kRm9ydW1zLnB1c2goZm9ydW0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTW92ZVRocmVhZC5jbG9zZSgpO1xyXG4gICAgICB9LCB7XHJcbiAgICAgICAgaGlkZU1vdmVUeXBlOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgbW92ZUZvcnVtKGFyciwgZiwgdHlwZSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IGFyci5pbmRleE9mKGYpO1xyXG4gICAgICBpZigodHlwZSA9PT0gXCJsZWZ0XCIgJiYgaW5kZXggPT09IDApIHx8ICh0eXBlID09PSBcInJpZ2h0XCIgJiYgaW5kZXgrMSA9PT0gYXJyLmxlbmd0aCkpIHJldHVybjtcclxuICAgICAgbGV0IG5ld0luZGV4O1xyXG4gICAgICBpZih0eXBlID09PSBcImxlZnRcIikge1xyXG4gICAgICAgIG5ld0luZGV4ID0gaW5kZXggLSAxO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld0luZGV4ID0gaW5kZXggKyAxO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG90aGVyQWQgPSBhcnJbbmV3SW5kZXhdO1xyXG4gICAgICBhcnIuc3BsaWNlKGluZGV4LCAxLCBvdGhlckFkKTtcclxuICAgICAgYXJyLnNwbGljZShuZXdJbmRleCwgMSwgZik7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlRm9ydW0oYXJyLCBpbmRleCkge1xyXG4gICAgICBhcnIuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgLypjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgc3dlZXRRdWVzdGlvbihcIuehruWumuimgeaJp+ihjOWIoOmZpOaTjeS9nO+8n1wiKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKCgpID0+IHt9KSovXHJcbiAgICB9LFxyXG4gICAgc2F2ZVJlY29tbWVuZEZvcnVtcygpIHtcclxuICAgICAgY29uc3QgZm9ydW1zSWQgPSB0aGlzLnJlY29tbWVuZEZvcnVtcy5tYXAoZm9ydW0gPT4gZm9ydW0uZmlkKTtcclxuICAgICAgbmtjQVBJKFwiL25rYy9ob21lXCIsIFwiUFVUXCIsIHtcclxuICAgICAgICBvcGVyYXRpb246IFwic2F2ZVJlY29tbWVuZEZvcnVtc1wiLFxyXG4gICAgICAgIGZvcnVtc0lkXHJcbiAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzd2VldFN1Y2Nlc3MoXCLkv53lrZjmiJDlip9cIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICB9LFxyXG4gICAgc2F2ZUNvbHVtbnMoKXtcclxuICAgICAgY29uc3QgY29sdW1uc0lkID0gdGhpcy5jb2x1bW5zLm1hcChjID0+IGMuX2lkKTtcclxuICAgICAgbmtjQVBJKFwiL25rYy9ob21lXCIsIFwiUFVUXCIsIHtcclxuICAgICAgICBvcGVyYXRpb246IFwic2F2ZUNvbHVtbnNcIixcclxuICAgICAgICBjb2x1bW5zSWRcclxuICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBzd2VldFN1Y2Nlc3MoXCLkv53lrZjmiJDlip9cIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgICB9LFxyXG4gICAgc2F2ZUdvb2RzKCkge1xyXG4gICAgICBjb25zdCBnb29kc0lkID0gdGhpcy5nb29kcy5tYXAoZyA9PiBnLnByb2R1Y3RJZCk7XHJcbiAgICAgIGNvbnN0IHNob3dTaG9wR29vZHMgPSAhIXRoaXMuc2hvd1Nob3BHb29kcztcclxuICAgICAgbmtjQVBJKFwiL25rYy9ob21lXCIsIFwiUFVUXCIsIHtcclxuICAgICAgICBvcGVyYXRpb246IFwic2F2ZUdvb2RzXCIsXHJcbiAgICAgICAgZ29vZHNJZCxcclxuICAgICAgICBzaG93U2hvcEdvb2RzXHJcbiAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgc3dlZXRTdWNjZXNzKFwi5L+d5a2Y5oiQ5YqfXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gICAgfSxcclxuICAgIHNhdmVUb3BwZWRUaHJlYWRzKCkge1xyXG4gICAgICBjb25zdCB0b3BwZWRUaHJlYWRzSWQgPSB0aGlzLnRvcHBlZFRocmVhZHMubWFwKHQgPT4gdC50aWQpO1xyXG4gICAgICBua2NBUEkoXCIvbmtjL2hvbWVcIiwgXCJQVVRcIiwge1xyXG4gICAgICAgIG9wZXJhdGlvbjogXCJzYXZlVG9wcGVkVGhyZWFkc1wiLFxyXG4gICAgICAgIHRvcHBlZFRocmVhZHNJZFxyXG4gICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHN3ZWV0U3VjY2VzcyhcIuS/neWtmOaIkOWKn1wiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKVxyXG4gICAgfSxcclxuICAgIHNhdmVPcmlnaW5hbFRocmVhZERpc3BsYXlNb2RlKCkge1xyXG4gICAgICBjb25zdCBvcmlnaW5hbFRocmVhZERpc3BsYXlNb2RlID0gdGhpcy5vcmlnaW5hbFRocmVhZERpc3BsYXlNb2RlO1xyXG4gICAgICBua2NBUEkoXCIvbmtjL2hvbWVcIiwgXCJQQVRDSFwiLCB7XHJcbiAgICAgICAgb3BlcmF0aW9uOiBcInNhdmVPcmlnaW5hbFRocmVhZERpc3BsYXlNb2RlXCIsXHJcbiAgICAgICAgb3JpZ2luYWxUaHJlYWREaXNwbGF5TW9kZVxyXG4gICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHN3ZWV0U3VjY2VzcyhcIuS/neWtmOaIkOWKn1wiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiJdfQ==

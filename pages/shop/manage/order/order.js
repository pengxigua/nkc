(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var CommonModal = new NKC.modules.CommonModal();
var Ship = new NKC.modules.ShopShip();
var ModifyPrice = new NKC.modules.ShopModifyPrice();
var Transfer = new NKC.modules.Transfer();

window.transfer = function (tUid) {
  Transfer.open(function () {}, tUid);
}; // 修改卖家备注


window.modifySellMessage = function (uid, orderId) {
  var dom = $("tr[data-order-id='".concat(orderId, "'] .data-sell-message"));
  CommonModal.open(function (data) {
    var value = data[0].value;
    nkcAPI('/shop/manage/' + uid + '/order/editSellMessage', "PUT", {
      sellMessage: value,
      orderId: orderId
    }).then(function () {
      dom.text(value);
      CommonModal.close();
      sweetSuccess("保存成功");
    })["catch"](sweetWarning);
  }, {
    title: "修改备注",
    data: [{
      value: dom.text(),
      dom: "textarea"
    }]
  });
}; // 获取金额 转换成数字且去掉￥


window.getNumber = function (str) {
  var fractionDigits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  str = str + "";
  str = str.replace("￥", "");
  str = parseFloat(str);
  str = str.toFixed(fractionDigits);
  return parseFloat(str);
}; // 重新计算订单总价


window.computeOrderPrice = function (orderId) {
  var orderDom = $("tr[data-order-id='".concat(orderId, "']"));
  var paramPriceDom = orderDom.find(".data-param-price");
  var countDom = orderDom.find(".data-param-count");
  var freightDom = orderDom.find(".data-params-freight");
  var prices = [];
  var counts = [];

  for (var i = 0; i < paramPriceDom.length; i++) {
    var dom = paramPriceDom.eq(i);
    prices.push(getNumber(dom.text(), 2));
  }

  for (var _i = 0; _i < countDom.length; _i++) {
    var _dom = countDom.eq(_i);

    counts.push(getNumber(_dom.text(), 0));
  }

  if (prices.length !== counts.length) return sweetError("订单页面错误，请刷新页面");
  var totalPrice = 0;

  for (var _i2 = 0; _i2 < prices.length; _i2++) {
    totalPrice += prices[_i2] * counts[_i2];
  }

  var freight = getNumber(freightDom.text(), 2);
  orderDom.find(".data-params-price").text("\uFFE5".concat(totalPrice.toFixed(2)));
  orderDom.find(".data-order-price").text("\uFFE5".concat((totalPrice + freight).toFixed(2)));
  return {
    paramsPrice: totalPrice,
    freightPrice: freight,
    orderPrice: totalPrice + freight
  };
}; // 修改商品单价


window.modifyParamPrice = function (sellUid, orderId, costId) {
  var priceDom = $("tr[data-order-id='".concat(orderId, "'][data-order-param-id='").concat(costId, "'] .data-param-price"));
  var countDom = $("tr[data-order-id='".concat(orderId, "'][data-order-param-id='").concat(costId, "'] .data-param-count"));
  var freightDom = $("tr[data-order-id='".concat(orderId, "'] .data-params-freight"));
  var freightPrice = getNumber(freightDom.text(), 2);
  var price = getNumber(priceDom.text(), 2);
  var count = getNumber(countDom.text(), 0);
  return ModifyPrice.open(function (data) {
    var newPrice = data;
    var checkNumber = NKC.methods.checkData.checkNumber;
    Promise.resolve().then(function () {
      checkNumber(newPrice, {
        name: "商品单价",
        min: 0.01,
        fractionDigits: 2
      });
      return nkcAPI("/shop/manage/".concat(sellUid, "/order/editCostRecord"), "PUT", {
        type: "modifyParam",
        costId: costId,
        orderId: orderId,
        freightPrice: freightPrice * 100,
        costObj: {
          singlePrice: newPrice * 100,
          count: count
        }
      });
    }).then(function () {
      priceDom.text("\uFFE5".concat(newPrice.toFixed(2)));
      computeOrderPrice(orderId);
      CommonModal.close();
    })["catch"](sweetError);
  }, price);
}; // 修改商品数量


window.modifyParamCount = function (sellUid, orderId, costId) {
  var countDom = $("tr[data-order-id='".concat(orderId, "'][data-order-param-id='").concat(costId, "'] .data-param-count"));
  var priceDom = $("tr[data-order-id='".concat(orderId, "'][data-order-param-id='").concat(costId, "'] .data-param-price"));
  var freightDom = $("tr[data-order-id='".concat(orderId, "'] .data-params-freight"));
  var freightPrice = getNumber(freightDom.text(), 2);
  var price = getNumber(priceDom.text(), 2);
  var count = getNumber(countDom.text(), 0);
  CommonModal.open(function (data) {
    var newCount = getNumber(data[0].value, 2);
    Promise.resolve().then(function () {
      NKC.methods.checkData.checkNumber(newCount, {
        name: "商品数量",
        min: 1
      });
      return nkcAPI("/shop/manage/".concat(sellUid, "/order/editCostRecord"), "PUT", {
        type: "modifyParam",
        costId: costId,
        orderId: orderId,
        freightPrice: freightPrice * 100,
        costObj: {
          singlePrice: price * 100,
          count: newCount
        }
      });
    }).then(function () {
      countDom.text("".concat(newCount));
      computeOrderPrice(orderId);
      CommonModal.close();
    })["catch"](sweetError);
  }, {
    title: "修改数量",
    data: [{
      dom: "input",
      value: count
    }]
  });
}; // 修改运费


window.modifyFreight = function (sellUid, orderId) {
  var freightDom = $("tr[data-order-id='".concat(orderId, "'] .data-params-freight"));
  var freightPrice = getNumber(freightDom.text(), 2);
  return ModifyPrice.open(function (data) {
    var newFreightPrice = data;
    Promise.resolve().then(function () {
      NKC.methods.checkData.checkNumber(newFreightPrice, {
        name: "运费",
        min: 0,
        fractionDigits: 2
      });
      return nkcAPI("/shop/manage/".concat(sellUid, "/order/editCostRecord"), "PUT", {
        type: "modifyFreight",
        orderId: orderId,
        freightPrice: newFreightPrice * 100
      });
    }).then(function () {
      freightDom.text("\uFFE5".concat(newFreightPrice.toFixed(2)));
      computeOrderPrice(orderId);
      CommonModal.close();
    })["catch"](sweetError);
  }, freightPrice);
}; // 发货/修改物流信息


window.ship = function (orderId) {
  Ship.open(function () {}, {
    orderId: orderId
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWdlcy9zaG9wL21hbmFnZS9vcmRlci9vcmRlci5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQUosQ0FBWSxXQUFoQixFQUFwQjtBQUNBLElBQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQUosQ0FBWSxRQUFoQixFQUFiO0FBQ0EsSUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBSixDQUFZLGVBQWhCLEVBQXBCO0FBQ0EsSUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBSixDQUFZLFFBQWhCLEVBQWpCOztBQUNBLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFVBQVMsSUFBVCxFQUFlO0FBQy9CLEVBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxZQUFXLENBRXhCLENBRkQsRUFFRyxJQUZIO0FBR0QsQ0FKRCxDLENBS0E7OztBQUNBLE1BQU0sQ0FBQyxpQkFBUCxHQUEyQixVQUFTLEdBQVQsRUFBYyxPQUFkLEVBQXVCO0FBQ2hELE1BQU0sR0FBRyxHQUFHLENBQUMsNkJBQXNCLE9BQXRCLDJCQUFiO0FBQ0EsRUFBQSxXQUFXLENBQUMsSUFBWixDQUFpQixVQUFDLElBQUQsRUFBVTtBQUN6QixRQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVEsS0FBdEI7QUFDQSxJQUFBLE1BQU0sQ0FBQyxrQkFBZ0IsR0FBaEIsR0FBb0Isd0JBQXJCLEVBQStDLEtBQS9DLEVBQXNEO0FBQUMsTUFBQSxXQUFXLEVBQUUsS0FBZDtBQUFxQixNQUFBLE9BQU8sRUFBRTtBQUE5QixLQUF0RCxDQUFOLENBQ0csSUFESCxDQUNRLFlBQVc7QUFDZixNQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVDtBQUNBLE1BQUEsV0FBVyxDQUFDLEtBQVo7QUFDQSxNQUFBLFlBQVksQ0FBQyxN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QUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBWCxFQUFELEVBQW9CLENBQXBCLENBQTlCO0FBQ0EsU0FBTyxXQUFXLENBQUMsSUFBWixDQUFpQixVQUFBLElBQUksRUFBSTtBQUM5QixRQUFNLGVBQWUsR0FBRyxJQUF4QjtBQUNBLElBQUEsT0FBTyxDQUFDLE9BQVIsR0FDRyxJQURILENBQ1EsWUFBTTtBQUNWLE1BQUEsR0FBRyxDQUFDLE9BQUosQ0FBWSxTQUFaLENBQXNCLFdBQXRCLENBQWtDLGVBQWxDLEVBQW1EO0FBQ2pELFFBQUEsSUFBSSxFQUFFLElBRDJDO0FBRWpELFFBQUEsR0FBRyxFQUFFLENBRjRDO0FBR2pELFFBQUEsY0FBYyxFQUFFO0FBSGlDLE9BQW5EO0FBS0EsYUFBTyxNQUFNLHdCQUFpQixPQUFqQiw0QkFBaUQsS0FBakQsRUFBd0Q7QUFDbkUsUUFBQSxJQUFJLEVBQUUsZUFENkQ7QUFFbkUsUUFBQSxPQUFPLEVBQVAsT0FGbUU7QUFHbkUsUUFBQSxZQUFZLEVBQUUsZUFBZSxHQUFHO0FBSG1DLE9BQXhELENBQWI7QUFLRCxLQVpILEVBYUcsSUFiSCxDQWFRLFlBQU07QUFDVixNQUFBLFVBQVUsQ0FBQyxJQUFYLGlCQUFvQixlQUFlLENBQUMsT0FBaEIsQ0FBd0IsQ0FBeEIsQ0FBcEI7QUFDQSxNQUFBLGlCQUFpQixDQUFDLE9BQUQsQ0FBakI7QUFDQSxNQUFBLFdBQVcsQ0FBQyxLQUFaO0FBQ0QsS0FqQkgsV0FrQlMsVUFsQlQ7QUFtQkQsR0FyQk0sRUFxQkosWUFyQkksQ0FBUDtBQXNCRCxDQXpCRCxDLENBMEJBOzs7QUFDQSxNQUFNLENBQUMsSUFBUCxHQUFjLFVBQVMsT0FBVCxFQUFrQjtBQUM5QixFQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsWUFBTSxDQUVmLENBRkQsRUFFRztBQUNELElBQUEsT0FBTyxFQUFQO0FBREMsR0FGSDtBQUtELENBTkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBDb21tb25Nb2RhbCA9IG5ldyBOS0MubW9kdWxlcy5Db21tb25Nb2RhbCgpO1xyXG5jb25zdCBTaGlwID0gbmV3IE5LQy5tb2R1bGVzLlNob3BTaGlwKCk7XHJcbmNvbnN0IE1vZGlmeVByaWNlID0gbmV3IE5LQy5tb2R1bGVzLlNob3BNb2RpZnlQcmljZSgpO1xyXG5jb25zdCBUcmFuc2ZlciA9IG5ldyBOS0MubW9kdWxlcy5UcmFuc2ZlcigpO1xyXG53aW5kb3cudHJhbnNmZXIgPSBmdW5jdGlvbih0VWlkKSB7XHJcbiAgVHJhbnNmZXIub3BlbihmdW5jdGlvbigpIHtcclxuXHJcbiAgfSwgdFVpZCk7XHJcbn1cclxuLy8g5L+u5pS55Y2W5a625aSH5rOoXHJcbndpbmRvdy5tb2RpZnlTZWxsTWVzc2FnZSA9IGZ1bmN0aW9uKHVpZCwgb3JkZXJJZCkge1xyXG4gIGNvbnN0IGRvbSA9ICQoYHRyW2RhdGEtb3JkZXItaWQ9JyR7b3JkZXJJZH0nXSAuZGF0YS1zZWxsLW1lc3NhZ2VgKTtcclxuICBDb21tb25Nb2RhbC5vcGVuKChkYXRhKSA9PiB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGRhdGFbMF0udmFsdWU7XHJcbiAgICBua2NBUEkoJy9zaG9wL21hbmFnZS8nK3VpZCsnL29yZGVyL2VkaXRTZWxsTWVzc2FnZScsIFwiUFVUXCIsIHtzZWxsTWVzc2FnZTogdmFsdWUsIG9yZGVySWQ6IG9yZGVySWR9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICBkb20udGV4dCh2YWx1ZSk7XHJcbiAgICAgICAgQ29tbW9uTW9kYWwuY2xvc2UoKTtcclxuICAgICAgICBzd2VldFN1Y2Nlc3MoXCLkv53lrZjmiJDlip9cIik7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChzd2VldFdhcm5pbmcpXHJcbiAgfSwge1xyXG4gICAgdGl0bGU6IFwi5L+u5pS55aSH5rOoXCIsXHJcbiAgICBkYXRhOiBbXHJcbiAgICAgIHtcclxuICAgICAgICB2YWx1ZTogZG9tLnRleHQoKSxcclxuICAgICAgICBkb206IFwidGV4dGFyZWFcIlxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfSlcclxufVxyXG4vLyDojrflj5bph5Hpop0g6L2s5o2i5oiQ5pWw5a2X5LiU5Y675o6J77+lXHJcbndpbmRvdy5nZXROdW1iZXIgPSBmdW5jdGlvbihzdHIsIGZyYWN0aW9uRGlnaXRzID0gMCkge1xyXG4gIHN0ciA9IHN0ciArIFwiXCI7XHJcbiAgc3RyID0gc3RyLnJlcGxhY2UoXCLvv6VcIiwgXCJcIik7XHJcbiAgc3RyID0gcGFyc2VGbG9hdChzdHIpO1xyXG4gIHN0ciA9IHN0ci50b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKTtcclxuICByZXR1cm4gcGFyc2VGbG9hdChzdHIpO1xyXG59XHJcbi8vIOmHjeaWsOiuoeeul+iuouWNleaAu+S7t1xyXG53aW5kb3cuY29tcHV0ZU9yZGVyUHJpY2UgPSBmdW5jdGlvbihvcmRlcklkKSB7XHJcbiAgY29uc3Qgb3JkZXJEb20gPSAkKGB0cltkYXRhLW9yZGVyLWlkPScke29yZGVySWR9J11gKTtcclxuICBjb25zdCBwYXJhbVByaWNlRG9tID0gb3JkZXJEb20uZmluZChcIi5kYXRhLXBhcmFtLXByaWNlXCIpO1xyXG4gIGNvbnN0IGNvdW50RG9tID0gb3JkZXJEb20uZmluZChcIi5kYXRhLXBhcmFtLWNvdW50XCIpO1xyXG4gIGNvbnN0IGZyZWlnaHREb20gPSBvcmRlckRvbS5maW5kKFwiLmRhdGEtcGFyYW1zLWZyZWlnaHRcIik7XHJcbiAgY29uc3QgcHJpY2VzID0gW107XHJcbiAgY29uc3QgY291bnRzID0gW107XHJcbiAgZm9yKGxldCBpID0gMDsgaSA8IHBhcmFtUHJpY2VEb20ubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGRvbSA9IHBhcmFtUHJpY2VEb20uZXEoaSk7XHJcbiAgICBwcmljZXMucHVzaChnZXROdW1iZXIoZG9tLnRleHQoKSwgMikpO1xyXG4gIH1cclxuICBmb3IobGV0IGkgPSAwOyBpIDwgY291bnREb20ubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGRvbSA9IGNvdW50RG9tLmVxKGkpO1xyXG4gICAgY291bnRzLnB1c2goZ2V0TnVtYmVyKGRvbS50ZXh0KCksIDApKTtcclxuICB9XHJcbiAgaWYocHJpY2VzLmxlbmd0aCAhPT0gY291bnRzLmxlbmd0aCkgcmV0dXJuIHN3ZWV0RXJyb3IoXCLorqLljZXpobXpnaLplJnor6/vvIzor7fliLfmlrDpobXpnaJcIik7XHJcbiAgbGV0IHRvdGFsUHJpY2UgPSAwO1xyXG4gIGZvcihsZXQgaSA9IDA7IGkgPCBwcmljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHRvdGFsUHJpY2UgKz0gcHJpY2VzW2ldICogY291bnRzW2ldO1xyXG4gIH1cclxuICBjb25zdCBmcmVpZ2h0ID0gZ2V0TnVtYmVyKGZyZWlnaHREb20udGV4dCgpLCAyKTtcclxuICBvcmRlckRvbS5maW5kKGAuZGF0YS1wYXJhbXMtcHJpY2VgKS50ZXh0KGDvv6Uke3RvdGFsUHJpY2UudG9GaXhlZCgyKX1gKTtcclxuICBvcmRlckRvbS5maW5kKGAuZGF0YS1vcmRlci1wcmljZWApLnRleHQoYO+/pSR7KHRvdGFsUHJpY2UgKyBmcmVpZ2h0KS50b0ZpeGVkKDIpfWApO1xyXG4gIHJldHVybiB7XHJcbiAgICBwYXJhbXNQcmljZTogdG90YWxQcmljZSxcclxuICAgIGZyZWlnaHRQcmljZTogZnJlaWdodCxcclxuICAgIG9yZGVyUHJpY2U6IHRvdGFsUHJpY2UgKyBmcmVpZ2h0XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8g5L+u5pS55ZWG5ZOB5Y2V5Lu3XHJcbndpbmRvdy5tb2RpZnlQYXJhbVByaWNlID0gZnVuY3Rpb24oc2VsbFVpZCwgb3JkZXJJZCwgY29zdElkKSB7XHJcbiAgY29uc3QgcHJpY2VEb20gPSAkKGB0cltkYXRhLW9yZGVyLWlkPScke29yZGVySWR9J11bZGF0YS1vcmRlci1wYXJhbS1pZD0nJHtjb3N0SWR9J10gLmRhdGEtcGFyYW0tcHJpY2VgKTtcclxuICBjb25zdCBjb3VudERvbSA9ICQoYHRyW2RhdGEtb3JkZXItaWQ9JyR7b3JkZXJJZH0nXVtkYXRhLW9yZGVyLXBhcmFtLWlkPScke2Nvc3RJZH0nXSAuZGF0YS1wYXJhbS1jb3VudGApO1xyXG4gIGNvbnN0IGZyZWlnaHREb20gPSAkKGB0cltkYXRhLW9yZGVyLWlkPScke29yZGVySWR9J10gLmRhdGEtcGFyYW1zLWZyZWlnaHRgKTtcclxuICBjb25zdCBmcmVpZ2h0UHJpY2UgPSBnZXROdW1iZXIoZnJlaWdodERvbS50ZXh0KCksIDIpO1xyXG4gIGNvbnN0IHByaWNlID0gZ2V0TnVtYmVyKHByaWNlRG9tLnRleHQoKSwgMik7XHJcbiAgY29uc3QgY291bnQgPSBnZXROdW1iZXIoY291bnREb20udGV4dCgpLCAwKTtcclxuICByZXR1cm4gTW9kaWZ5UHJpY2Uub3BlbihkYXRhID0+IHtcclxuICAgIGNvbnN0IG5ld1ByaWNlID0gZGF0YTtcclxuICAgIGNvbnN0IGNoZWNrTnVtYmVyID0gTktDLm1ldGhvZHMuY2hlY2tEYXRhLmNoZWNrTnVtYmVyO1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNoZWNrTnVtYmVyKG5ld1ByaWNlLCB7XHJcbiAgICAgICAgICBuYW1lOiBcIuWVhuWTgeWNleS7t1wiLFxyXG4gICAgICAgICAgbWluOiAwLjAxLFxyXG4gICAgICAgICAgZnJhY3Rpb25EaWdpdHM6IDJcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmtjQVBJKGAvc2hvcC9tYW5hZ2UvJHtzZWxsVWlkfS9vcmRlci9lZGl0Q29zdFJlY29yZGAsIFwiUFVUXCIsIHtcclxuICAgICAgICAgIHR5cGU6IFwibW9kaWZ5UGFyYW1cIixcclxuICAgICAgICAgIGNvc3RJZCxcclxuICAgICAgICAgIG9yZGVySWQsXHJcbiAgICAgICAgICBmcmVpZ2h0UHJpY2U6IGZyZWlnaHRQcmljZSAqIDEwMCxcclxuICAgICAgICAgIGNvc3RPYmo6IHtcclxuICAgICAgICAgICAgc2luZ2xlUHJpY2U6IG5ld1ByaWNlICogMTAwLFxyXG4gICAgICAgICAgICBjb3VudFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBwcmljZURvbS50ZXh0KGDvv6Uke25ld1ByaWNlLnRvRml4ZWQoMil9YCk7XHJcbiAgICAgICAgY29tcHV0ZU9yZGVyUHJpY2Uob3JkZXJJZCk7XHJcbiAgICAgICAgQ29tbW9uTW9kYWwuY2xvc2UoKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gIH0sIHByaWNlKVxyXG59XHJcblxyXG4vLyDkv67mlLnllYblk4HmlbDph49cclxud2luZG93Lm1vZGlmeVBhcmFtQ291bnQgPSBmdW5jdGlvbihzZWxsVWlkLCBvcmRlcklkLCBjb3N0SWQpIHtcclxuICBjb25zdCBjb3VudERvbSA9ICQoYHRyW2RhdGEtb3JkZXItaWQ9JyR7b3JkZXJJZH0nXVtkYXRhLW9yZGVyLXBhcmFtLWlkPScke2Nvc3RJZH0nXSAuZGF0YS1wYXJhbS1jb3VudGApO1xyXG4gIGNvbnN0IHByaWNlRG9tID0gJChgdHJbZGF0YS1vcmRlci1pZD0nJHtvcmRlcklkfSddW2RhdGEtb3JkZXItcGFyYW0taWQ9JyR7Y29zdElkfSddIC5kYXRhLXBhcmFtLXByaWNlYCk7XHJcbiAgY29uc3QgZnJlaWdodERvbSA9ICQoYHRyW2RhdGEtb3JkZXItaWQ9JyR7b3JkZXJJZH0nXSAuZGF0YS1wYXJhbXMtZnJlaWdodGApO1xyXG4gIGNvbnN0IGZyZWlnaHRQcmljZSA9IGdldE51bWJlcihmcmVpZ2h0RG9tLnRleHQoKSwgMik7XHJcbiAgY29uc3QgcHJpY2UgPSBnZXROdW1iZXIocHJpY2VEb20udGV4dCgpLCAyKTtcclxuICBjb25zdCBjb3VudCA9IGdldE51bWJlcihjb3VudERvbS50ZXh0KCksIDApO1xyXG4gIENvbW1vbk1vZGFsLm9wZW4oKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IG5ld0NvdW50ID0gZ2V0TnVtYmVyKGRhdGFbMF0udmFsdWUsIDIpO1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIE5LQy5tZXRob2RzLmNoZWNrRGF0YS5jaGVja051bWJlcihuZXdDb3VudCwge1xyXG4gICAgICAgICAgbmFtZTogXCLllYblk4HmlbDph49cIixcclxuICAgICAgICAgIG1pbjogMVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBua2NBUEkoYC9zaG9wL21hbmFnZS8ke3NlbGxVaWR9L29yZGVyL2VkaXRDb3N0UmVjb3JkYCwgXCJQVVRcIiwge1xyXG4gICAgICAgICAgdHlwZTogXCJtb2RpZnlQYXJhbVwiLFxyXG4gICAgICAgICAgY29zdElkLFxyXG4gICAgICAgICAgb3JkZXJJZCxcclxuICAgICAgICAgIGZyZWlnaHRQcmljZTogZnJlaWdodFByaWNlICogMTAwLFxyXG4gICAgICAgICAgY29zdE9iajoge1xyXG4gICAgICAgICAgICBzaW5nbGVQcmljZTogcHJpY2UgKiAxMDAsXHJcbiAgICAgICAgICAgIGNvdW50OiBuZXdDb3VudFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICBcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvdW50RG9tLnRleHQoYCR7bmV3Q291bnR9YCk7XHJcbiAgICAgICAgY29tcHV0ZU9yZGVyUHJpY2Uob3JkZXJJZCk7XHJcbiAgICAgICAgQ29tbW9uTW9kYWwuY2xvc2UoKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gIH0sIHtcclxuICAgIHRpdGxlOiBcIuS/ruaUueaVsOmHj1wiLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgZG9tOiBcImlucHV0XCIsXHJcbiAgICAgICAgdmFsdWU6IGNvdW50XHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9KTtcclxufVxyXG5cclxuLy8g5L+u5pS56L+Q6LS5XHJcbndpbmRvdy5tb2RpZnlGcmVpZ2h0ID0gZnVuY3Rpb24oc2VsbFVpZCwgb3JkZXJJZCkge1xyXG4gIGNvbnN0IGZyZWlnaHREb20gPSAkKGB0cltkYXRhLW9yZGVyLWlkPScke29yZGVySWR9J10gLmRhdGEtcGFyYW1zLWZyZWlnaHRgKTtcclxuICBjb25zdCBmcmVpZ2h0UHJpY2UgPSBnZXROdW1iZXIoZnJlaWdodERvbS50ZXh0KCksIDIpO1xyXG4gIHJldHVybiBNb2RpZnlQcmljZS5vcGVuKGRhdGEgPT4ge1xyXG4gICAgY29uc3QgbmV3RnJlaWdodFByaWNlID0gZGF0YTtcclxuICAgIFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBOS0MubWV0aG9kcy5jaGVja0RhdGEuY2hlY2tOdW1iZXIobmV3RnJlaWdodFByaWNlLCB7XHJcbiAgICAgICAgICBuYW1lOiBcIui/kOi0uVwiLFxyXG4gICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgZnJhY3Rpb25EaWdpdHM6IDJcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmtjQVBJKGAvc2hvcC9tYW5hZ2UvJHtzZWxsVWlkfS9vcmRlci9lZGl0Q29zdFJlY29yZGAsIFwiUFVUXCIsIHtcclxuICAgICAgICAgIHR5cGU6IFwibW9kaWZ5RnJlaWdodFwiLFxyXG4gICAgICAgICAgb3JkZXJJZCxcclxuICAgICAgICAgIGZyZWlnaHRQcmljZTogbmV3RnJlaWdodFByaWNlICogMTAwLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgZnJlaWdodERvbS50ZXh0KGDvv6Uke25ld0ZyZWlnaHRQcmljZS50b0ZpeGVkKDIpfWApO1xyXG4gICAgICAgIGNvbXB1dGVPcmRlclByaWNlKG9yZGVySWQpO1xyXG4gICAgICAgIENvbW1vbk1vZGFsLmNsb3NlKCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICB9LCBmcmVpZ2h0UHJpY2UpO1xyXG59XHJcbi8vIOWPkei0py/kv67mlLnnianmtYHkv6Hmga9cclxud2luZG93LnNoaXAgPSBmdW5jdGlvbihvcmRlcklkKSB7XHJcbiAgU2hpcC5vcGVuKCgpID0+IHtcclxuICBcclxuICB9LCB7XHJcbiAgICBvcmRlcklkXHJcbiAgfSlcclxufVxyXG4iXX0=

window.comfirmReceipt = function(orderId) {
  sweetQuestion("确认收货后，货款将打入卖家账户，请再次确认。")
    .then(() => {
      nkcAPI('/shop/order/'+orderId+'/receipt', "PUT", {})
        .then(function(data) {
          sweetSuccess("执行成功");
          window.location.reload();
        })
        .catch(sweetErro)
    })
    .catch(err => null)
}

!function(n){"function"==typeof define&&define.amd?define(n):n()}((function(){"use strict";window.clearBanSale=function(n){confirm("是否接触该商品禁售状态")&&nkcAPI("/e/settings/shop/products/clearban","PUT",{productId:n}).then((function(n){window.location.reload()})).catch((function(n){screenTopWarning(n||n.error)}))}}));
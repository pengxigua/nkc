var data = NKC.methods.getDataById('data');
var phoneVerify = data.safeSettings.phoneVerify
phoneVerify.enable = String(phoneVerify.enable);
var app = new Vue({
  el: "#app",
  data: {
    safeSettings: data.safeSettings,
    error: "",
    password: '',
    password2: '',
    passwordForm: false,
    info: ""
  },
  methods: {
    save: function() {
      var safeSettings = this.safeSettings;
      var passwordForm = this.passwordForm;
      var password = this.password;
      var password2 = this.password2;
      return Promise.resolve()
        .then(function() {
          var t = 5;
          if(safeSettings.experimentalTimeout >= t) {}
          else {
            throw '后台密码过期时间不能小于'+t+'分钟';
          }
          var body = {
            safeSettings: safeSettings
          }
          if(passwordForm) {
            if(!password) throw '请输入后台密码';
            if(password !== password2) throw '两次输入的密码不一致';
            body.password = password;
          }
          return nkcAPI('/e/settings/safe', 'PUT', body)
        })
        .then(function() {
          sweetSuccess('保存成功');
        })
        .catch(sweetError);
    },
    runWeakPasswordCheck: function() {
      nkcAPI("/e/settings/safe/weakPasswordCheck", "GET")
        .then(function() {
          sweetAlert("检测已启动，将在后台执行，请大概5分钟后查看结果")
        })
        .catch(sweetError)
    }
  }
});

window.phoneVerify = phoneVerify;
window.app = app;

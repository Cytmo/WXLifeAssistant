//index.js
//获取应用实例
const app = getApp()
var openid = wx.getStorageSync("openid");
Page({
  data: {
    hasUserInfo: [],
    alreadyGetUserInfo : false,
    userInfo:[],
  },
  doAuthorization: function(e) {

    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          alreadyGetUserInfo: true
        })
      },
      fail:function(err){
        console.log("record  失败", err);
      }
    })
    if(false){
      //todo 已获得用户信息后不再弹出授权
      console.log(alreadyGetUserInfo)
    }else{
    var that = this;
    console.log("调用了 doAuthorization 授权");
    // console.log(e);
   
      //授权
      wx.login({
        success: function(res) {
          console.log('login:code', res.code)
          wx.request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxcf9a5cc5ed4abadb&secret=bbf59871d44cc7a980fcb9f6d382d6a0&js_code=${res.code}&grant_type=authorization_code`,
            success:(res)=>{
              console.log(res);
              // userInfo.openid= res.openid;
              // //获取到你的openid
              // console.log(userInfo.openid);
              app.globalData.userID=res.data.openid;
              console.log(app.globalData.userID)
            }
          })
          }

      })
      
    }
    

  },
  loadUserInfo: function() {
    var that = this;
    if (openid != "") {
      wx.getUserProfile({
        success: res => {
          console.log("wx获得用户信息:", res);
          var data = {
            "openid": openid,
            "user": res.userInfo
          }
          //发送信息给服务器获得用户信息
          wx.request({
            url: app.globalData.userInterfaceUrl + 'login',
            dataType: "json",
            method: "POST",
            data: data,
            success: function(res) {
              console.log("loadUserInfo（服務器返回） success", res.data);
              if (!res.data.error) {
                app.globalData.userInfo = res.data.data;
                that.setData({
                  userInfo: app.globalData.userInfo
                })
              } else {
                console.log("服务器获取用戶信息失敗");
                //TODO：用户信息获取错误
              }
            },
            fail: function(e) {
              console.log("loadUserInfo（服务器返回）error", e);
              //TODO:错误
            },
            complete: function(e) {
              //完成
            }
          })
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
        }
      })
    }
  },

  // 事件处理函数
  onShow: function() {
    var that = this;
    console.log("openid:", openid);
    that.loadUserInfo();
  }
})

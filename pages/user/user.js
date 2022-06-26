//index.js
//获取应用实例
import {loadSuccess,loadFailed,handleRes} from '../../utils/czutils'
const app = getApp()
var openid = wx.getStorageSync("openid");
Page({
  data: {
    hasUserInfo: false,
    userInfo: [],
    userID: ""
  },
  doAuthorization: function (e) {
    var ifYes=true
    var that =this
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("设置userInfo 为: " + res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        console.log("存储userInfo 为: " + res.userInfo, );
        console.log(res.userInfo);
        app.globalData.userInfo=res.userInfo
        wx.setStorageSync('userInfo', res.userInfo, );
        that.login();
      },
      fail: function (err) {
        console.log("record  失败", err);
        loadFailed("获取用户信息失败");
      }
    })

   

    },

    login:function(){
        var that = this;
        console.log("调用了 doAuthorization 授权");
        // console.log(e);
        //授权
        wx.login({
          success: function (res) {
            console.log('login:code', res.code)
            wx.request({
              url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxcf9a5cc5ed4abadb&secret=bbf59871d44cc7a980fcb9f6d382d6a0&js_code=${res.code}&grant_type=authorization_code`,
              success: (res) => {
                //console.log(res);
                //获取到你的openid
                that.setData({
                  userID: res.data.openid
  
                });
                console.log("存储openid 为: " + res.data.openid);
                wx.setStorageSync('openid', res.data.openid);
                console.log("设置openid 为: " + res.data.openid);
                app.globalData.userID = res.data.openid;
                console.log("userId 为: " + res.data.openid);
                that.registerAndLogin()
  
              }
            })
  
          }
  
        })
    },

  registerAndLogin: function () {
    //首先请求登录，如果失败则进行注册
    var token;
    var userID = app.globalData.userID;
    console.log(userID)
    var that = this
    console.log("取得的userID为" + userID)
    if ((app.globalData.userInfo != [])) {
      console.log("开始请求token")
      wx.request({
        url: app.globalData.url + "/user/login",
        data: {
          wechatId: userID
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          if(res.data.code == 0){
            token = res.data.token
            wx.setStorageSync('token', token)
            console.log("userId 为： " + res.data.user.userId)
            wx.setStorageSync('userId', res.data.user.userId)
            app.globalData.userId = res.data.user.userId;
          }else{
            console.log("登陆失败，准备注册")
            console.log(res.data)
            that.userRegister()   
          }

        },
        fail: function (error) {
          console.log("登陆失败，准备注册")
          console.log(error)
          that.userRegister()           
        }
      })
    } 
  },

  userRegister() {
    var that = this
    wx.request({
      url: app.globalData.url + "/user/register",
      data: {
        "wechatId": app.globalData.userID,
        "username": app.globalData.userInfo.nickName,
        "image": app.globalData.userInfo.avatarUrl
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code == 0){
          console.log(res)
          that.registerAndLogin()
        }else{
          console.log(res)
          loadFailed("注册失败")
        }
        
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  // 事件处理函数
  onShow: function () {
    var that = this;
    if (app.globalData.userInfo.avatarUrl != null) {
      console.log("已获取到本地信息，隐藏登录按钮");
      this.setData({
        hasUserInfo: true
      });
    }
    wx.getStorage({
      key: 'ifShowWarn',
      success(res) {
        if (res.data == 1) {
          wx.showToast({
            title: '请先登录',
            icon: "error",
            duration: 2000
          })
          wx.setStorageSync('ifShowWarn', 0)
        }
      }
    })
    //that.loadUserInfo();
  },

  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        if (res.data == [] || res.data == null) {
          console.log("本地存储的userInfo为空");
        } else {
          that.setData({
            userInfo: res.data
          })
        }
      }
    });
  }
})
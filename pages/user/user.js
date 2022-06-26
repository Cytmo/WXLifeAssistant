//index.js
//获取应用实例
import {loadSuccess,loadFailed,handleRes} from '../../utils/czutils'
const app = getApp()
var openid = wx.getStorageSync("openid");
Page({
  data: {
    hasUserInfo: false,
    userInfo: [],
    userID: "",
    array: ['INTJ-建筑师', 'INTP-逻辑学家', 'ENTJ-指挥家', 'ENTP-辩论家',
      'INFJ-提倡者', 'ENFP-调停者', 'ENFJ-主人公', 'ENFP-竞选者',
      'ISTJ-物流师', 'ISFJ-守卫者', 'ESTJ-总经理', 'ESFJ执政官',
      'ISTP-鉴赏家', 'ISFP-探险家', 'ESTP-企业家', 'ESFP-表演者'
    ],
      index:''

  },
  doAuthorization: function (e) {
    var ifYes = true
    var that = this
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
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo,);
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
          if (res.data.code == 12) {
            that.userRegister()
          }
          console.log(res.data)
          if(res.data.code == 0){
            token = res.data.token
            wx.setStorageSync('token', token)
            console.log("userId 为： " + res.data.user.userId)
            wx.setStorageSync('userId', res.data.user.userId)
            app.globalData.userId = res.data.user.userId;
            app.globalData.userInformation = res.data.user;
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
  
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
    var index = parseInt(e.detail.value)

    index++
    console.log('态度索引', index)
    if(index == 0){
      wx.showToast({
        title: '默认，无法设置',
        icon:'error',
      })
    }else{
    var that = this
    // 向后端发送请求 mbti
    wx.request({
      url: app.globalData.url + "/user/mbti",
      data: {
        userId: app.globalData.userId,
        mbti: index
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: that.data.array[e.detail.value],
          icon:'success'
        })
      },
      fail: function (error) {
        wx.showToast({
          title: '请求失败，请检查你的网络情况',
          icon:'error'
        })
      }
    })

  }

  },
  goToMBTI:function(){
    wx.navigateTo({
      url: './MBTI',
    })
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
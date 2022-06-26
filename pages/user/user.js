//index.js
//获取应用实例
const app = getApp()
var openid = wx.getStorageSync("openid");
Page({
  data: {
    hasUserInfo: false,
    userInfo: [],
    userID: "",
    array: ['保密', 'INTJ', 'INTP', 'ENTJ', 'ENTP',
            'INFJ', 'ENFP', 'ENFJ', 'ENFP',
            'ISTJ', 'ISFJ', 'EdTJ', 'ESFJ',
            'ISTP', 'ISFP', 'ESTP', 'ESFP'],
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


        console.log("存储userInfo 为: " + res.userInfo,);
        console.log(res.userInfo);
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo,);
        that.login();
      },
      fail: function (err) {
        console.log("record  失败", err);

      }
    })



  },

  login: function () {

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
  }
  // wx.request({
  //   url: app.globalData.url + "/user/register",
  //   data: {
  //     "wechatId": app.globalData.openID,
  //     "username": this.userInfo.nickName,
  //     "phone": "19813218574",
  //     "image": this.avatarUrl,
  //   },
  //   method: 'POST',
  //   header: {
  //     'content-type': 'application/json'
  //   },
  //   success: function (res) {
  //     console.log(res)
  //   },
  //   fail: function (error) {
  //     console.log(error)
  //   }
  // })


  ,

  
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
          token = res.data.token
          wx.setStorageSync('token', token)
          console.log("userId 为： " + res.data.user.userId)
          wx.setStorageSync('userId', res.data.user.userId)
          app.globalData.userId = res.data.user.userId;

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
        "image":app.globalData.userInfo.avatarUrl
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.registerAndLogin()
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  goToMBTI(){
    wx.navigateTo({url:'MBTI'})

  },
  // gotoChatList() {
  //   var token;
  //   var userID = app.globalData.openId;
  //   console.log("取得的userID为" + userID)
  //   if ((this.userInfo != [])) {
  //     {
  //       console.log("开始请求token")
  //       wx.request({
  //         url: app.globalData.url + "/user/login",
  //         data: {
  //           //数据urlencode方式编码，变量间用&连接，再post
  //           wechatId: userID
  //         },
  //         method: 'POST',
  //         header: {
  //           'content-type': 'application/json'
  //         },
  //         success: function (res) {
  //           console.log(res.data)
  //           token = res.data.token
  //           console.log("userId 为： " + res.data.user.userId)
  //           app.globalData.userId = res.data.user.userId;
  //           wx.navigateTo({
  //             url: '../expandspages/chat-list/chat-list?&userid=' + res.data.user.userId + "&token=" + token,

  //           })
  //         },
  //         fail: function (error) {
  //           console.log(error)
  //         }
  //       })
  //     }
  //   } else {
  //     wx.showToast({
  //       title: '请先登录',
  //       content: '请先登录',
  //       icon: "error",
  //       success: function (res) {
  //         if (res.confirm) { //这里是点击了确定以后
  //           console.log('用户点击确定')
  //         } else { //这里是点击了取消以后
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  // },
  // loadUserInfo: function() {
  //   var that = this;
  //   if (this.openid != "") {
  //     wx.getUserProfile({
  //       success: res => {
  //         console.log("wx获得用户信息:", res);
  //         var data = {
  //           "openid": openid,
  //           "user": res.userInfo
  //         }
  //         //发送信息给服务器获得用户信息
  //         wx.request({
  //           url: app.globalData.userInterfaceUrl + 'login',
  //           dataType: "json",
  //           method: "POST",
  //           data: data,
  //           success: function(res) {
  //             console.log("loadUserInfo（服務器返回） success", res.data);
  //             if (!res.data.error) {
  //               app.globalData.userInfo = res.data.data;
  //               that.setData({
  //                 userInfo: app.globalData.userInfo
  //               })
  //             } else {
  //               console.log("服务器获取用戶信息失敗");
  //               //TODO：用户信息获取错误
  //             }
  //           },
  //           fail: function(e) {
  //             console.log("loadUserInfo（服务器返回）error", e);
  //             //TODO:错误
  //           },
  //           complete: function(e) {
  //             //完成
  //           }
  //         })
  //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //         // 所以此处加入 callback 以防止这种情况
  //         if (this.userInfoReadyCallback) {
  //           this.userInfoReadyCallback(res)
  //         }
  //       }
  //     })
  //   }
  // },

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
    console.log('态度索引', e.detail.value)
    this.setData({
      index: e.detail.value
    })

    var that = this
    // 向后端发送请求 mbti
    wx.request({
      url: app.globalData.url + "/user/mbti",
      data: {
        userId: app.globalData.userId,
        mbti: that.data.index
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: that.data.array[e.detail.value]+',设置成功',
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
import AppIMDelegate from "./delegate/app-im-delegate";
App(

  {
    globalData: {
      notification: {},
      mapPosition: {},
      circles: {},
      mapPosition1: {},
      circles1: {},
      movies: {},
      // 高分电影数据
      moviesHighRanks: {},
      userInterfaceUrl: null,
      userInfo: {},
      novelsyuepiao: {},
      // 小说推荐榜
      novelsrecom: {},
      // 小说女频月票榜
      novelsmmyuepiao: {},
      // 小说月票榜
      novelsmmrecom: {},
      tvHot: {},
      //userID为 openid
      userID: '1',
      userId:'1',
      openId: '',
      url: "http://localhost:8081",
      novelShow: {},
      tvsHighRanks: {},
      token:""
    },
    getIMHandler() {
      return this.appIMDelegate.getIMHandlerDelegate();
    },

    onLaunch: function (options) {
      this.appIMDelegate = new AppIMDelegate(this);
      this.appIMDelegate.onLaunch(options);
      var that = this;
      wx.getStorage({
        key: 'openid',
        success(res) {
          console.log("成功读取本地id：" + res.data)
          that.globalData.openId = res.data;
        }
      });

      wx.getStorage({
        key: 'userInfo',
        success(res) {
          console.log("成功读取本地userInfo：" + res.data)
          that.globalData.userInfo = res.data;
          that.registerAndLogin()
        }
      });

      wx.setStorageSync('ifShowWarn', 0)

    },



    onHide() {
      this.appIMDelegate.onHide();
    },

    onShow(options) {
      this.appIMDelegate.onShow(options);
    
    },

    registerAndLogin: function () {
      //首先请求登录，如果失败则进行注册
      var token;
      var userID = this.globalData.openId;
      console.log(userID)
      var that = this
      console.log("取得的userID为" + userID)
      if ((this.globalData.userInfo != [])) {
        console.log("开始请求token")
        wx.request({
          url: that.globalData.url + "/user/login",
          data: {
            wechatId: userID
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            token = res.data.token
            wx.setStorageSync('token', token)
            console.log("userId 为： " + res.data.user.userId)
            wx.setStorageSync('userId', res.data.user.userId)
            that.globalData.userId = res.data.user.userId;
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
        url: that.globalData.url + "/user/register",
        data: {
          "wechatId": that.globalData.openID,
          "username": that.globalData.userInfo.nickName,
          "phone": "19813218574",
          "image": that.globalData.userInfo.avatarUrl,
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


    getUserInfo: function (cb) {
      var that = this
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    },


  })
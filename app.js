import AppIMDelegate from "./delegate/app-im-delegate";
App(

  {
    globalData: {
      notification:{},
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
      userID: '1',
      userId:'',
      openId: '',
      url: "http://10.131.150.190:8081",
      novelShow:{},
      tvsHighRanks:{},
      //userID在用户未登录时为1，登陆后为openid
      userID: 1,
      openId: '',
    },
    getIMHandler() {
      return this.appIMDelegate.getIMHandlerDelegate();
    },

    onLaunch: function (options) {
      this.appIMDelegate = new AppIMDelegate(this);
      this.appIMDelegate.onLaunch(options);
      var that=this;
     wx.getStorage({
        key: 'openid',
        success(res) {
          console.log("成功读取本地id："+res.data)
          that.globalData.openId = res.data;
        }
      });
  
      wx.getStorage({
        key: 'userInfo',
        success(res) {

          console.log("成功读取本地userInfo："+ res.data)
          that.globalData.userInfo=res.data;
        }
      });


    },



    onHide() {
      this.appIMDelegate.onHide();
    },

    onShow(options) {
      this.appIMDelegate.onShow(options);
    },



    getUserInfo:function(cb){
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
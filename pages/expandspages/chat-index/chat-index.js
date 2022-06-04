// pages/expandspages/chat-index/chat-index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getStorageSync('lastPage', "home")
    if(lastPage=="chat"){
      wx.navigateTo({
        url: '/pages/homepage/recs',
      })
    }else{

    }

    this.gotoChatList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  gotoChatList(){
    var token;
    var userID = app.globalData.openId;
    if(userID==null||userID=="1"||userID==""){
      wx.showToast({
        title: '请先登录',
        icon:"error"
      })
      return
    }
    console.log("取得的userID为"+userID)
    if((this.userInfo!=[])){{
      console.log("开始请求token")
      wx.request({
        url: app.globalData.url+"/user/login",
        data: {
          //数据urlencode方式编码，变量间用&连接，再post
          wechatId: userID
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          token=res.data.token
          console.log("userId 为： "+res.data.user.userId)
          app.globalData.userId=res.data.user.userId
          wx.navigateTo({
            url:'../chat-list/chat-list?&userid='+res.data.user.userId+"&token="+token,
            
          })
        },
        fail: function (error) {
          console.log(error)
        }
      })
    }
    }
    else{
      wx.showToast({
        title: '请先登录',
        content: '请先登录',
        icon:"error",
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
          } else {//这里是点击了取消以后
            console.log('用户点击取消')
          }
        }
      })
    }
  },
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
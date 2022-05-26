
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id : '',
    type: '',
    title:'',
    novel: {},
    navTitle: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var id=params.id
    var kind=params.kind
    console.log(id)
    console.log(kind)

    var novel
  if(kind=="yuepiao"){
    novel=app.globalData.novelsyuepiao[id]
  }else if(kind=="recom"){
    novel=app.globalData.novelsrecom[id]
  }else if(kind=="mmyuepiao"){
    novel=app.globalData.novelsmmyuepiao[id]
  }else if(kind=="mmrecom"){
    novel=app.globalData.novelsmmrecom[id]
  }
    this.setData({novel:novel})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navTitle,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
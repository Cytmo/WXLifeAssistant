// pages/recs/recs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image1:"/images/IMG_0921.png",
    image2:"/images/IMG_0921.png",
    image3:"/images/IMG_0921.png"
  },
  gotoMovie:function(){
    wx.navigateTo({
      url: '/pages/recommendspages/movies/movies',
    })
  },
  gotoNovel:function(){
    wx.navigateTo({
      url: '/pages/recommendspages/novel/novel-index/novel-index',
    })
  },
  gotoTVSeries:function(){
    wx.navigateTo({
      url: '/pages/recommendspages/TVSeries/TVSeries',
    })
  },
  gotoGroup:function(){
    wx.navigateTo({
      url: '/pages/recommendspages/group/group',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
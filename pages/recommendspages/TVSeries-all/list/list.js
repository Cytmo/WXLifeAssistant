
const app = getApp()
// var util = require('../../utils/list_common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    type:'in_theaters',
    tvs:{}, // 接收返回的数组
    kind:'',
    hasMore: false,
    // 分页加载
    page: 1,
    size: 20,
  },

  gotodetail:function (param){
    wx.navigateTo({
      url: '../item/item?&id='+param.currentTarget.dataset.index+'&kind='+param.currentTarget.dataset.kind,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {

    let that = this;
    setTimeout(function() {
      that.setData({
        loading: true
      })
    }, 500)


    this.setData({kind:params.type})    
    if(params.type=="hot"){
     var tvs=app.globalData.tvHot
    this.setData({tvs:tvs})
    }else if(params.type=="old"){
      var tvs=app.globalData.tvsHighRanks
      this.setData({tvs:tvs})
    }
 

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
  onUnload: function (options) {

    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (res) {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
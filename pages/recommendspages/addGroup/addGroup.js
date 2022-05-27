// pages/recommendspages/add-group/addGroup.js
var ipv4 = "http://10.131.148.225:8081"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  groupadd:function(e){
    var addNew = e.detail.value
    var userId = app.globalData.userID
    var that = this; 
    var sendUrl = ipv4 + "/group/addgroup"
    wx.request({
      url: sendUrl,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data:{
        postId : userId,
        name : addNew.name,
        number : addNew.number,
        qcCode : addNew.qcCode,
        introduction : addNew.introduction
      },
      success: function(res) {
        console.log(res.data)
        wx.navigateTo({
          url: '../group/group?&pageid=' + 3
        })
      },
      fail: function(error) {
        console.log(error)
      }
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
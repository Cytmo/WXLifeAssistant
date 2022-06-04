var util = require('../../../../utils/util.js');
var th = require('../../../../utils/throttle/throttle.js');
import { formatTime,formatDate } from '../../../../utils/common'
import {handleRes} from '../../../../utils/czutils'
// miniprogram/pages/publishTopics/publishTopics.js
const app = getApp();
var ipv4 = "http://localhost:80"
// var ipv4 = "http://localhost:8081"
// var ipv4 = app.globalData.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId : 1,
    content: null,
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: null  //标亮的导航按钮的下标，如果是其他子页面，可以赋值为null
    })
  }
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userId = app.globalData.userId;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  hollowSubmit:function(event){
    var content = event.detail.value.content;
    var time = formatTime(new Date());
    if (content == null || content == ""){
      util.showTip("话题内容不能为空");
      return;
    }
    console.log('form发生了submit事件，提交数据：', event.detail.value);
    var that = this
    var urlsend = ipv4 + "/hollow/createHollow"
    wx.request({
      url: urlsend,
      method: 'post',
      header: {
        'content-type': 'application/json' // 豆瓣一定不能是json
      },
      data:{
        time : time,
        content: content,
        under_post_id : 0,
        reply_post_id : 0,
        belong_to : that.data.userId
      },
      success: function(res) {
        handleRes(res)
        if(res.data.code == 0){
          wx.redirectTo({
            url : '/pages/expandspages/treehole/index/index'
          })
        }
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          canshow : false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
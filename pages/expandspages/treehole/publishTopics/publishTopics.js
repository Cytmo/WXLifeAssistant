var util = require('../../../../utils/util.js');
var th = require('../../../../utils/throttle/throttle.js');
import { formatTime,formatDate } from '../../../../utils/common'
// miniprogram/pages/publishTopics/publishTopics.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId : 1,
    content: null,
    // radioitems:[
    //   { text: '树洞广场和我的树洞，对所有人可见', value: 0, checked: true},
    //   { text: '我的树洞，仅对自己可见' , value: 1, checked: false}
    // ],
    currentvalue:0
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
    // this.data.userInfo = app.globalData.userInfo;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  formSubmit: th.throttle(function (that,e) {
    console.log(e.detail.value.content)
    if (e.detail.value.content == null || e.detail.value.content == ""){
      util.showTip("话题内容不能为空");
      return;
    }
    console.log('form发生了submit事件，提交数据：', e.detail.value);
    that.data.content = e.detail.value.content; 
    //发布时间
    let time = formatTime(new Date());
  },1500),
  formReset: function () {
    console.log('form发生了reset事件');
    //清空图片列表
    this.setData({
      imageList: null,
      currentvalue: -1
    });
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
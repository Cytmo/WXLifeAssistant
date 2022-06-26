// pages/recommendspages/add-group/addGroup.js
import { $init, $digest } from '../../../utils/common'
import { promisify } from '../../../utils/promise.util'
// var ipv4 = "http://10.131.148.225:8081"

const app = getApp()
var ipv4 =app.globalData.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    image_size : "0%"
  },

  groupadd:function(e){
    var addNew = e.detail.value
    var userId = app.globalData.userId
    var that = this; 
    var sendUrl = ipv4 + "/group/addgroup"
    wx.showLoading({
      title: '正在添加...',
      mask: true
    })
    wx.uploadFile({
      filePath: that.data.images[0],
      name: 'file',
      url: sendUrl,
      formData:{
        'postId' : userId,
        'name' : addNew.name,
        'number' : addNew.number,
        'introduction' : addNew.introduction
      },
      success(res){
        console.log(res.data)
        wx.hideLoading()
        wx.showToast({
          title: '操作成功',
          mask : true,
          icon: 'none',
          duration: 2000//持续的时间
        })
        wx.navigateBack()
      },
      fail(error) {
        console.log(error)
        wx.hideLoading()
        wx.showToast({
          title: error.msg,
          mask : true,
          icon: 'none',
          duration: 2000//持续的时间
        })
      }
    })
  },

  chooseImage(e) {
    
    wx.chooseImage({
      sizeType: ['compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下1张照片
        this.data.images = images.length <= 1 ? images : images.slice(0, 1) 
        this.data.image_size  ="100%"
        $digest(this)
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    this.data.image_size = "0%"
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    $init(this)
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
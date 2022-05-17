/**
 * 页面的初始数据
 */
Page({

  data: {
    
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接收其他页面传递过来的参数
    let movieId = options.id, that = this;
    wx.showLoading({
      title: '加载影片信息中...',
    })
    wx.request({
      url: "http://api.douban.com/v2/movie/subject/" + movieId,
      data: {
        apikey: '0b2bdeda43b5688921839c8ecb20399b'
      },
      //url: "https://douban.uieee.com/v2/movie/subject/" + movieId,
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.setData({ detail: res.data });
        wx.hideLoading()
      }
    })
    
  }
  })
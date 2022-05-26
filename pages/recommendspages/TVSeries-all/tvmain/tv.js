// movie/moviemain/movie.js
// 获取全局应用程序实例对象
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tvs:{},
  
    boardItems: [
      {
        key: 'Hot TVs',
        title: '热门电视剧榜单'
      }
    ]

  },

  // 轮播图点击事件
  onItemClick: function (event) {
    var kind = event.target.dataset.type==1?"hot":"old";

    wx.navigateTo({
      url: '../item/item?&id=0'
    })
  },


  gotoHotList:function (){
    wx.navigateTo({
      url: '../list/list',
    })
  },




  onLoad(options) {
    var url = app.globalData.url+"/recom/tv";
    var userID = app.globalData.userID;
    this.getData(url,userID);
  },
getData: function (url,userID) {
    var that = this;
    wx.request({
      url:url,
      data: {
        //数据urlencode方式编码，变量间用&连接，再post
        msg:'tv',
        wechatId:userID
      },
      method: 'POST',
      header: {
        'content-type':'application/json'
      },
      success: function(res) {
          that.procseeData(res.data)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
 
  // 处理数据函数
  procseeData: function(datas) {
    var objects = [];
    for (var idx in datas.data) {
        var subject = datas.data[idx];
      var title = subject.name;
      if (title.length >= 10) {
        title = title.substring(0, 10) + "···";
      }
      var attitude;
      switch(subject.myattitude){
        case 1: 
          attitude="推荐";
          break;
          case 0: 
          attitude="暂无";
          break;
          case -1: 
          attitude="不推荐";
          break;
          // default:
          //   attitude="暂无"
      }
      var temp = {
      description: subject.description,
      unrecommendtotal: subject.unrecommendtotal,
      info: subject.info,
      image: subject.image,
      attitude: attitude,
      detailpage: subject.detailpage,
      recommendtotal: subject.recommendtotal,
      ranks: subject.ranks,
      name: title
      }
      objects.push(temp);
      this.setData({tvs:objects});
      app.globalData.tvHot=objects;
      // console.log(readyData);
      }
     

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
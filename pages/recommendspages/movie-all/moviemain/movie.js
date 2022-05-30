// movie/moviemain/movie.js
// 获取全局应用程序实例对象
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:{},
    moviesHighRanks:{},
    boardItems: [
      {
        key: 'new_movies',
        title: '热门电影榜单'
      },
      {
        key: 'highranks',
        title: '高分电影榜单'
      }
    ]

  },

  // 轮播图点击事件
  onItemClick: function (event) {
    var kind = event.target.dataset.type==1?"hot":"old";

    wx.navigateTo({
      url: '../item/item?&id=0'+'&kind='+kind
    })
  },


  gotoHotList:function (){

    wx.navigateTo({
      url: '../list/list?type=hot',
    })
    
  },
  gotoHighRanksList:function (){

    wx.navigateTo({
      url: '../list/list?type=old',
    })
    
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var url = app.globalData.url+"/recom/movie";
    var userID = app.globalData.userID;
    this.getData(url,userID);
  },
getData: function (url,userID) {
    var that = this;
    wx.request({
      url:url,
      data: {
        //数据urlencode方式编码，变量间用&连接，再post
        msg:'movie',
        wechatid:userID
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
    var objectsHighRank=[];
    var cnt = 0;
    for (var idx in datas.data) {
      cnt++;
      if(cnt >10){
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
      type: subject.type,
      info: subject.info,
      image: subject.image,
      attitude: subject.myattitude,
      detailpage: subject.detailpage,
      recommendtotal: subject.recommendtotal,
      ranks: subject.ranks,
      name: title
      }
      objectsHighRank.push(temp);
      this.setData({moviesHighRanks:objectsHighRank});
      app.globalData.moviesHighRanks=objectsHighRank;
      // console.log(readyData);
      }
      else{
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
      type: subject.type,
      info: subject.info,
      image: subject.image,
      myattitude: attitude,
      detailpage: subject.detailpage,
      recommendtotal: subject.recommendtotal,
      ranks: subject.ranks,
      name: title
      }
      objects.push(temp);
      // var readyData = {};
      // readyData = {
      //   objects: objects,
      // }
      // 数据绑定
      this.setData({movies:objects});
      app.globalData.movies=objects;
      // console.log(readyData);
    }
    //console.log(objects);
  }
    loading: false;
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

var util = require('../../utils/utils.js')
// 获取全局的app
var app = getApp();
 
Page({
 
  // RESTFUL API  json
  // SOAP XML 用的相当少
 
  /**
   * 页面的初始数据
   */
  data: {
    // 下面三个必须写！！！
    inTheaters: {},
    comingSoon: {},
    top250: {}
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(event) {
    // 正在热映
    var inTheatersUrl = app.globaData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    // 即将上映
    var comingSoonUrl = app.globaData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    // 前250
    var top250Url = app.globaData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl, "inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon","即将上映");
    this.getMovieListData(top250Url, "top250","豆瓣Top250");
 
  },
 
  getMovieListData: function (url, settedKey, cagetoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/xml' // 豆瓣一定不能是json
      },
      success: function(res) {
        that.procseeDoubanData(res.data, settedKey, cagetoryTitle)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
 
  // 处理数据函数
  procseeDoubanData: function(moviesDouban, settedKey,cagetoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "···";
      }
      // [1,1,1,1,1]  [1,1,1,0,0]
      var temp = {
        stars: util.converToStarsArray(subject.rating.stars), // 评分，星星
        title: title, // 电影名称
        average: subject.rating.average, // 评分
        coverageUrl: subject.images.large, // 海报
        movieId: subject.id // id
      }
      movies.push(temp);
      var readyData = {};
      readyData[settedKey] = {
        cagetoryTitle: cagetoryTitle,
        movies: movies,
      }
      // 数据绑定
      this.setData(readyData);
    }
  },
 
})
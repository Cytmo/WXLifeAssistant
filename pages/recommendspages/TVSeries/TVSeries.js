
var util = require('../../../util.js')
// 获取全局的app
var app = getApp();
 
Page({
 
  // RESTFUL API  json
  // SOAP XML 用的相当少
 
  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    loading: false
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(event) {
    // 正在热映
    var inTheatersUrl = "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=time&page_limit=${event.count}&page_start=${event.start}";
    // 即将上映
    var comingSoonUrl = "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=time&page_limit=${event.count}&page_start=${event.start}";
    // 前250
    var top250Url = "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=time&page_limit=${event.count}&page_start=${event.start}";

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
    //var cnt=0;
    for (var idx in moviesDouban.subjects) {
      //cnt++;
      //if(cnt>3) continue;
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      var recNum = "1000";
      var notrecNum = "100";
      if (title.length >= 6) {
        title = title.substring(0, 6) + "···";
      }
      // [1,1,1,1,1]  [1,1,1,0,0]
      // 导演等信息等待后续修改，暂时为占位
      var dir = "导演："+"11"
      var length = "片长："+"11分钟"
      var temp = {
        stars: util.converToStarsArray(subject.rate), // 评分，星星
        title: title, // 电影名称
        average: subject.rate, // 评分
        coverageUrl: subject.cover, // 海报
        movieId: subject.id, // id
        director: dir,
        length:length,
        rec:recNum,
        notrec:notrecNum
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
    loading: false;
  },
 
})
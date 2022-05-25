
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
    loading: false
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(event) {
    url = app.globalData.url+"/recom/novel";
    userID = app.globalData.userID;
    this.getData(url,userID);
  },



  getData: function (url,userID) {
    var that = this;
    wx.request({
      url:url,
      data: {
        //数据urlencode方式编码，变量间用&连接，再post
        msg:'novel',
        wechatid:userID
      },
      method: 'POST',
      header: {
        'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.ret == 200) {
          that.procseeData(res.data)
        }
        else{
          console.log('http response not correct')
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
 
  // 处理数据函数
  procseeData: function(datas) {
    var objects = [];
    //var cnt=0;
    for (var idx in datas.subjects) {
      //cnt++;
      //if(cnt>3) continue;
      var subject = datas.subjects[idx];
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
      objects.push(temp);
      var readyData = {};
      readyData[0] = {
        objects: objects,
      }
      // 数据绑定
      this.setData(readyData);
    }
    loading: false;
  },
 
})
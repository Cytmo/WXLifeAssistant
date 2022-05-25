
var util = require('../../../../util.js')
// 获取全局的app
var app = getApp();
 
Page({
 
  // RESTFUL API  json
  // SOAP XML 用的相当少
 
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    novelData: {},
    objects:{}
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(event) {
    var url = app.globalData.url+"/recom/novel";
    var userID = app.globalData.userID;
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
      if (title.length >= 6) {
        title = title.substring(0, 6) + "···";
      }
      var temp = {
        title: title,
        coverageUrl: subject.image, 
        intro: subject.intro,
        updatedchapter: subject.updatedchapter,
        type:subject.type,
        writer:subject.author
      }
      objects.push(temp);
      // var readyData = {};
      // readyData = {
      //   objects: objects,
      // }
      // 数据绑定
      this.setData({objects:objects});
      // console.log(readyData);
    }
    console.log(objects);
    loading: false;
  },
 
})
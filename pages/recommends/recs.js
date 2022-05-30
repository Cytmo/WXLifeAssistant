// pages/recs/recs.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image1:"/images/IMG_0921.png",
    image2:"/images/IMG_0921.png",
    image3:"/images/IMG_0921.png"
  },
  gotoMovie:function(){
    wx.navigateTo({
      url: '/pages/recommendspages/movie-all/moviemain/movie',
    })
  },
  gotoNovel:function(){
    wx.navigateTo({
      url: '/pages/recommendspages/novel-all/novelmain/novel',
    })
  },
  gotoTVSeries:function(){
    wx.navigateTo({
      url: '/pages/recommendspages/TVSeries-all/tvmain/tv',
    })
  },
  gotoGroup:function(){
    wx.navigateTo({
      url: '/pages/recommendspages/group/group?&pageid=' + 0,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var url = app.globalData.url+"/map/all";
    var userID = app.globalData.userID;
    
 this.getData(url,userID);
  },
  getData: function (url,userID) {
    var that = this;
    wx.request({
      url:url,
      data: {
        //数据urlencode方式编码，变量间用&连接，再post
        msg:'get all position',
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
    var objects1 = [];
    var cnt = 0;
    
    for (var idx in datas.data) {
      cnt++;
        var subject = datas.data[idx];
      // var title = subject.name;
      // if (title.length >= 10) {
      //   title = title.substring(0, 10) + "···";
      // }
      var temp = {
        id:cnt,
        iconPath: '../images/location.png',
        width: 25,
        height: 48,
        title:subject.address,
        city:subject.city,
        kind:subject.kind,
        latitude:subject.latitude,
        date:subject.dates,
        longitude:subject.longitude,
        primarykey:subject.primarykey
            }
        var temp1=
            {
              latitude: temp.latitude,
              longitude: temp.longitude,
              color: "#00000000",
              date:subject.dates,
              fillColor: "#0000ff20",
              strokeWidth: 0,
              radius: 120
            }
       var temp2=
            {
              latitude: temp.latitude,
              longitude: temp.longitude,
              color: "#00000000",
              date:subject.dates,
              fillColor: "#ff000040",
              strokeWidth: 0,
              radius: 60
            }
      objects.push(temp);
      objects1.push(temp2);
      objects1.push(temp1);

   
      }
      this.setData({
        mapPosition:objects,
        circles:objects1,
        mapPosition1:objects,
        circles1:objects1
      });
      app.globalData.mapPosition=objects;
      app.globalData.circles=objects1;
      app.globalData.mapPosition1=objects;
      app.globalData.circles1=objects1;
      //console.log(app.globalData.mapPosition1);
      // console.log(readyData);
    

  }
  ,

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
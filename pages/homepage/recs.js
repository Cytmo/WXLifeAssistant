// pages/recs/recs.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notification: [],
    swiperList: [{
      id: 0,
      type: 'image',
      url: '/images/homepagephoto/homepage2.png'
    }, {
      id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }],
    PageCur: 'basics'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
 
  //跳转其他微信小程序
  gotoOther1: function () {
    wx.navigateToMiniProgram({
      appId: 'wx20499591d49cdb5c',
      success(res) {
        // 打开成功
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var url = app.globalData.url + "/map/all";
    var url1 = app.globalData.url + "/notice/all";
    var userID = app.globalData.openId;

    this.getData(url, userID);
    this.getNotification(url1, userID);
  },
  getData: function (url, userID) {
    var that = this;
    wx.request({
      url: url,
      data: {
        //数据urlencode方式编码，变量间用&连接，再post
        msg: 'get all position',
        wechatid: userID
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.procseeData(res.data)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  // 处理数据函数
  procseeData: function (datas) {
    var objects = [];
    var objects1 = [];
    var cnt = 0;

    for (var idx in datas.data) {
      cnt++;
      var subject = datas.data[idx];
      var temp = {
        id: cnt,
        iconPath: '../images/location.png',
        width: 25,
        height: 48,
        title: subject.address,
        city: subject.city,
        kind: subject.kind,
        latitude: subject.latitude,
        date: subject.dates,
        longitude: subject.longitude,
        primarykey: subject.primarykey
      }
      var temp1 = {
        latitude: temp.latitude,
        longitude: temp.longitude,
        color: "#00000000",
        date: subject.dates,
        fillColor: "#0000ff20",
        strokeWidth: 0,
        radius: 120
      }
      var temp2 = {
        latitude: temp.latitude,
        longitude: temp.longitude,
        color: "#00000000",
        date: subject.dates,
        fillColor: "#ff000040",
        strokeWidth: 0,
        radius: 60
      }
      objects.push(temp);
      objects1.push(temp2);
      objects1.push(temp1);


    }
    this.setData({
      mapPosition: objects,
      circles: objects1,
      mapPosition1: objects,
      circles1: objects1
    });
    app.globalData.mapPosition = objects;
    app.globalData.circles = objects1;
    app.globalData.mapPosition1 = objects;
    app.globalData.circles1 = objects1;


  },


  getNotification: function (url, userID) {
    var that = this;
    wx.request({
      url: url,
      data: {
        //数据urlencode方式编码，变量间用&连接，再post
        msg: 'get all notice',
        wechatid: userID
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.procseeNotificationData(res.data)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  // 处理数据函数
  procseeNotificationData: function (datas) {
    var objects = [];

    for (var idx in datas.data) {
      var subject = datas.data[idx];
      var temp = {
        date:subject.date,
        kind:subject.kind,
        publisher:subject.publisher,
        wechatid:subject.wechatid,
        title:subject.title,
        type:subject.type,
        content:subject.content
      }
      
      objects.push(temp);
    }
    this.setData({
      notification: objects,
    });
    app.globalData.notification = objects;


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

  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})
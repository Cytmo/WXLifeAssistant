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
      url: 'https://cdn-hz.skypixel.com/uploads/cn_files/photo/image/d465bec0-667c-41a1-91e0-cb09677b7f18.jpg@!1920'
    }, {
      id: 1,
        type: 'image',
        url: 'https://img1.baidu.com/it/u=1798290659,959328327&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
    }, {
      id: 2,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp1-tt.byteimg.com%2Forigin%2Fdfic-imagehandler%2F0b02e8b2-8b2f-4a1d-b291-31763080fc69%3Ffrom%3Dpc&refer=http%3A%2F%2Fp1-tt.byteimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659077364&t=02b9855e77e2e266a2a6a7b908ef720e'
    }, {
      id: 3,
      type: 'image',
      url: 'https://img2.baidu.com/it/u=4229575606,1399481933&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281'
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
  onTabItemTap(){
    return
   var that =this
  if(app.globalData.userId=="0"&&app.globalData.userID=="0"){
      wx.showToast({
          title: '请先登录',
          icon:"error",
          duration:2000
        })
        wx.setStorageSync('ifShowWarn',1)
          wx.switchTab({
            
            url: '/pages/user/user',
          })
  }
    // wx.getStorage({
    //   key:'token',
    //   success(res){
    //     console.log("成功读取本地token")
    //     console.log(res.data)
    //     var token = res.data
    //     that.setData({
    //       token:res.data
    //     },()=>{
    //       that.userId = app.globalData.userId
    //       that.authorization(token)
    //     })
        
    // },
    // fail(res){
    //     wx.showToast({
    //       title: '请先登录',
    //       icon:"error",
    //       duration:2000
    //     })
    //     wx.setStorageSync('ifShowWarn',1)
    //       wx.switchTab({
            
    //         url: '/pages/user/user',
    //       })
        
    // }
  // })
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
  showNotice:function () {

     this.setData({
      modalName: "Modal"
    })
    
  },

   hideModal(e) {
    this.setData({
      modalName: null
    })

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
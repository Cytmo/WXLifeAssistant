// movie/moviemain/movie.js
// 获取全局应用程序实例对象
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    moviesHighRanks: {},
    boardItems: [{
        key: 'new_movies',
        title: '热门电影榜单'
      },
      {
        key: 'highranks',
        title: '高分电影榜单'
      }
    ],
    swiperList: []

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var url = app.globalData.url + "/recom/movie";
    var userID = app.globalData.userID;
    this.getData(url, userID);
  },
  // onItemClick: function (event) {
  //   var kind = event.target.dataset.type==1?"hot":"old";

  //   wx.navigateTo({
  //     url: '../item/item?&id=0'+'&kind='+kind
  //   })
  // },

  gotoHotList: function () {

    wx.navigateTo({
      url: '../list/list?type=hot',
    })
  },
  gotoHighRanksList: function () {
    wx.navigateTo({
      url: '../list/list?type=old',
    })
  },


  getData: function (url, userID) {
    var that = this;
    wx.request({
      url: url,
      data: {
        //数据urlencode方式编码，变量间用&连接，再post
        msg: 'movie',
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
    var object1 = [];
    var object2 = [];
    var objects = [];
    var objectsHighRank = [];
    var cnt = 0;
    var ID=0;
    var Image="image";
    for (var idx in datas.data) {
      cnt++;
      if (cnt > 10) {
        var subject = datas.data[idx];
        var title = subject.name;
        if (title.length >= 10) {
          title = title.substring(0, 10) + "···";
        }
        var attitude;
        switch (subject.myattitude) {
          case 1:
            attitude = "推荐";
            break;
          case 0:
            attitude = "暂无";
            break;
          case -1:
            attitude = "不推荐";
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

        var tmp2 = {
          id: ID,
          type: Image,
          url: subject.image
        }
        if (ID <8) {
          console.log(subject.name)
          object1.push(tmp2)
          ID++;
        }

 
        // console.log(readyData);
      } else {
        var subject = datas.data[idx];
        var title = subject.name;
        if (title.length >= 10) {
          title = title.substring(0, 10) + "···";
        }
        var attitude;
        switch (subject.myattitude) {
          case 1:
            attitude = "推荐";
            break;
          case 0:
            attitude = "暂无";
            break;
          case -1:
            attitude = "不推荐";
            break;
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
 
        var tmp2 = {
          id: ID,
          type: Image,
          url: subject.image
        }
        if (ID <4) {
          console.log(subject.name)
          object2.push(tmp2)
          ID++;
        }

      }
    }
    this.setData({
      moviesHighRanks: objectsHighRank
    });
    app.globalData.moviesHighRanks = objectsHighRank;
    
    this.setData({
      movies: objects
    });
    app.globalData.movies = objects;
    // console.log(readyData);


    object1.push.apply(object1,object2);
    console.log(object1);
    this.setData({
      swiperList: object1,
    }, () => {})
    this.towerSwiper('swiperList');

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
  onReachBottom() {},

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
    console.log("towerSwiper: " + name)
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
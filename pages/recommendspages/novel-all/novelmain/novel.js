// novel/novelmain/novel.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    novels: {},
    novelsyuepiao: {},
    novelsrecom: {},
    novelsmmyuepiao: {},
    novelsmmrecom: {},
    boardItems: [{
        key: 'yuepiao',
        title: '起点月票榜单'
      },
      {
        key: 'recom',
        title: '起点推荐榜单'
      },
      {
        key: 'mmyuepiao',
        title: '起点女频月票榜单'
      },
      {
        key: 'recom',
        title: '起点女频推荐榜单'
      }
    ],
    cardCur: 0,
    swiperList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 初始化towerSwiper 传已有的数组名即可
    var url = app.globalData.url + "/recom/novel";
    var userID = app.globalData.userID;
    this.getData(url, userID);
  },

  gotoyuepiao: function () {

    wx.navigateTo({
      url: '../list/list?type=yuepiao',
    })

  },
  gotorecom: function () {

    wx.navigateTo({
      url: '../list/list?type=recom',
    })

  },
  onItemClick: function (event) {
    var kind = event.target.dataset.type;

    wx.navigateTo({
      url: '../item/item?&id=0' + '&kind=' + kind
    })
  },
  gotommyuepiao: function () {

    wx.navigateTo({
      url: '../list/list?type=mmyuepiao',
    })

  },
  gotommrecom: function () {

    wx.navigateTo({
      url: '../list/list?type=mmrecom',
    })

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
      }
    })
  },

  // 处理数据函数
  procseeData: function (datas) {

    var object1 = [];
    var object2 = [];
    var object3 = [];
    var object4 = [];

    var objects1 = [];
    var objects2 = [];
    var objects3 = [];
    var objects4 = [];
    var cnt = 0;
    var ID = 0;
    var Image = "image";
    for (var idx in datas.data) {
      cnt++;
      if (cnt <= 10) {

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
          unrecommendtotal: subject.unrecommendtotal,
          introduction: subject.introduction,
          image: subject.image,
          attitude: attitude,
          author: subject.author,
          recommendtotal: subject.recommendtotal,
          ranks: subject.ranks,
          updatedchapter: subject.updatedchapter,
          name: subject.name,
          category: subject.category,
          subcategory: subject.subcategory,
          completionstatus: subject.completionstatus,
          intp   :subject.intp,
          entj   :subject.entj,
          entp   :subject.entp,
          infj   :subject.infj,
          infp   :subject.infp,
          enfj   :subject.enfj,
          enfp   :subject.enfp,
          istj   :subject.istj,
          isfj   :subject.isfj,
          estj   :subject.estj,
          esfj   :subject.esfj,
          istp   :subject.istp,
          isfp   :subject.isfp,
          estp   :subject.estp,
          esfp   :subject.esfp,
          unintj :subject.unintj,
          unintp :subject.unintp,
          unentj :subject.unentj,
          unentp :subject.unentp,
          uninfj :subject.uninfj,
          uninfp :subject.uninfp,
          unenfj :subject.unenfj,
          unenfp :subject.unenfp,
          unistj :subject.unistj,
          unisfj :subject.unisfj,
          unestj :subject.unestj,
          unesfj :subject.unesfj,
          unistp :subject.unistp,
          unisfp :subject.unisfp,
          unestp :subject.unestp,
          unesfp :subject.unesfp
        }

        var tmp2 = {
          id: ID,
          type: Image,
          url: subject.image
        }
        if (ID <3) {
          object1.push(tmp2)
          ID++;
        }
        objects1.push(temp);
      } else if (cnt <= 20) {
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
          unrecommendtotal: subject.unrecommendtotal,
          introduction: subject.introduction,
          image: subject.image,
          attitude: attitude,
          author: subject.author,
          recommendtotal: subject.recommendtotal,
          ranks: subject.ranks,
          updatedchapter: subject.updatedchapter,
          name: subject.name,
          category: subject.category,
          subcategory: subject.subcategory,
          completionstatus: subject.completionstatus,
          intp   :subject.intp,
          entj   :subject.entj,
          entp   :subject.entp,
          infj   :subject.infj,
          infp   :subject.infp,
          enfj   :subject.enfj,
          enfp   :subject.enfp,
          istj   :subject.istj,
          isfj   :subject.isfj,
          estj   :subject.estj,
          esfj   :subject.esfj,
          istp   :subject.istp,
          isfp   :subject.isfp,
          estp   :subject.estp,
          esfp   :subject.esfp,
          unintj :subject.unintj,
          unintp :subject.unintp,
          unentj :subject.unentj,
          unentp :subject.unentp,
          uninfj :subject.uninfj,
          uninfp :subject.uninfp,
          unenfj :subject.unenfj,
          unenfp :subject.unenfp,
          unistj :subject.unistj,
          unisfj :subject.unisfj,
          unestj :subject.unestj,
          unesfj :subject.unesfj,
          unistp :subject.unistp,
          unisfp :subject.unisfp,
          unestp :subject.unestp,
          unesfp :subject.unesfp
        }
        objects2.push(temp);

        var tmp2 = {
          id: ID,
          type: Image,
          url: subject.image
        }
        if (ID < 5) {
          object2.push(tmp2)
          ID++;
        }

      } else if (cnt <= 30) {
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
          unrecommendtotal: subject.unrecommendtotal,
          introduction: subject.introduction,
          image: subject.image,
          attitude: attitude,
          author: subject.author,
          recommendtotal: subject.recommendtotal,
          ranks: subject.ranks,
          updatedchapter: subject.updatedchapter,
          name: subject.name,
          category: subject.category,
          subcategory: subject.subcategory,
          completionstatus: subject.completionstatus,
          intp   :subject.intp,
          entj   :subject.entj,
          entp   :subject.entp,
          infj   :subject.infj,
          infp   :subject.infp,
          enfj   :subject.enfj,
          enfp   :subject.enfp,
          istj   :subject.istj,
          isfj   :subject.isfj,
          estj   :subject.estj,
          esfj   :subject.esfj,
          istp   :subject.istp,
          isfp   :subject.isfp,
          estp   :subject.estp,
          esfp   :subject.esfp,
          unintj :subject.unintj,
          unintp :subject.unintp,
          unentj :subject.unentj,
          unentp :subject.unentp,
          uninfj :subject.uninfj,
          uninfp :subject.uninfp,
          unenfj :subject.unenfj,
          unenfp :subject.unenfp,
          unistj :subject.unistj,
          unisfj :subject.unisfj,
          unestj :subject.unestj,
          unesfj :subject.unesfj,
          unistp :subject.unistp,
          unisfp :subject.unisfp,
          unestp :subject.unestp,
          unesfp :subject.unesfp
        }
        objects3.push(temp);

        var tmp2 = {
          id: ID,
          type: Image,
          url: subject.image
        }
        if (ID < 8) {
          object3.push(tmp2)
          ID++;
        }
      } else if (cnt <= 40) {
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
          unrecommendtotal: subject.unrecommendtotal,
          introduction: subject.introduction,
          image: subject.image,
          attitude: attitude,
          author: subject.author,
          recommendtotal: subject.recommendtotal,
          ranks: subject.ranks,
          updatedchapter: subject.updatedchapter,
          name: subject.name,
          category: subject.category,
          subcategory: subject.subcategory,
          completionstatus: subject.completionstatus,
          intp   :subject.intp,
          entj   :subject.entj,
          entp   :subject.entp,
          infj   :subject.infj,
          infp   :subject.infp,
          enfj   :subject.enfj,
          enfp   :subject.enfp,
          istj   :subject.istj,
          isfj   :subject.isfj,
          estj   :subject.estj,
          esfj   :subject.esfj,
          istp   :subject.istp,
          isfp   :subject.isfp,
          estp   :subject.estp,
          esfp   :subject.esfp,
          unintj :subject.unintj,
          unintp :subject.unintp,
          unentj :subject.unentj,
          unentp :subject.unentp,
          uninfj :subject.uninfj,
          uninfp :subject.uninfp,
          unenfj :subject.unenfj,
          unenfp :subject.unenfp,
          unistj :subject.unistj,
          unisfj :subject.unisfj,
          unestj :subject.unestj,
          unesfj :subject.unesfj,
          unistp :subject.unistp,
          unisfp :subject.unisfp,
          unestp :subject.unestp,
          unesfp :subject.unesfp
        }
        objects4.push(temp);

        var tmp2 = {
          id: ID,
          type: Image,
          url: subject.image
        }
       
        if (ID <10) {
          object4.push(tmp2);
          ID++;
        }

      }
    }
    this.setData({
      novelsyuepiao: objects1
    });
    app.globalData.novelsyuepiao = objects1;

    this.setData({
      novelsrecom: objects2
    });
    app.globalData.novelsrecom = objects2;

    this.setData({
      novelsmmrecom: objects4
    });
    app.globalData.novelsmmrecom = objects4;

    this.setData({
      novelsmmyuepiao: objects3
    });
    app.globalData.novelsmmyuepiao = objects3;


    object2.push.apply(object2,object4);
    object2.push.apply(object2,object1);
    object2.push.apply(object2,object3);

    this.setData({
      swiperList: object2,
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
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
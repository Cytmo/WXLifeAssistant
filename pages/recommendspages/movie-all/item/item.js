const app = getApp()

import * as echarts from '../../../../components/ec-canvas/echarts';



Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: {},
    attitudeFor: 0,
    attitudeAgainst: 0,
    id: '',
    type: '',
    isLoading: false,
    movieName: '',
    title: '',
    movie: {},
    navTitle: '',
    showDescFull: true, // 简介展开,true显示简介所有内容
    showDescFull1: false, // 简介展开,true显示简介所有内容
    showDescFull2: false, // 简介展开,true显示简介所有内容
    desc60words: '',
    flag: false,
    flag1: false,
    flag2: false,
    show: '',
    detailInfo: '',
    ec: {},
    option: {},
    ec2: {},
    option2: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var id = params.id
    var kind = params.kind
    var movies
    this.setData({
      index: params
    })
    if (kind == "hot") {
      movies = app.globalData.movies[id]
    } else {
      movies = app.globalData.moviesHighRanks[id]
    }
    console.log("我的态度" + movies.myattitude)
    console.log(movies)
    this.setData({movie:movies})
    if (movies.myattitude == 1) {
      this.setData({
        attitudeFor: 1,
        attitudeAgainst: 0
      })
    } else if (movies.myattitude == -1) {
      this.setData({
        attitudeFor: 0,
        attitudeAgainst: -1
      })
    } else {
      this.setData({
        attitudeFor: 0,
        attitudeAgainst: 0
      })
    }
    this.initChartData(movies)
    var ec = {
      onInit: this.initChart
    }
    this.setData({
      ec: ec
    })
    var ec2 = {
      onInit: this.initChart2
    }
    this.setData({
      ec2: ec2
    })
    //加载图表

    var tmp = this.getDesc60Words(movies.description)
    var tmp1 = movies.description
    var detailInfo = this.splitMovieInfo(movies.info)
    this.setData({
      detailInfo: detailInfo
    })
    var number = parseInt(movies.description.length)
    if (number > 60) {
      this.setData({
        showDescFull: false,
        show: tmp
      })
    } else {}
  },


  agreeDefault: function () {
    console.log("支持")
    var that=this
    var params = that.data.index
    var id = params.id
    var kind = params.kind
    var tmp
    if (kind == "hot") {
      tmp=app.globalData.movies[id]
    } else {
      tmp=app.globalData.moviesHighRanks[id]
    }
    console.log(tmp)
    console.log("原态度为"+tmp.myattitude)
    if(tmp.myattitude==0){
       tmp.recommendtotal++;
       tmp.myattitude=1;
    }else if(tmp.myattitude==-1){
      tmp.recommendtotal++;
      tmp.unrecommendtotal--;
      tmp.myattitude=1;
    }
    console.log("修改后态度为"+tmp.myattitude)
    if (kind == "hot") {
      app.globalData.movies[id]=tmp
    } else {
      app.globalData.moviesHighRanks[id]=tmp
    }
    this.setData({
      attitudeFor: 1,
      attitudeAgainst: 0,
      movie:tmp
    })

    //发送给后端
    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      personality: personality,
      ranks: that.data.movie.ranks,
      attitude: 1,
      name: that.data.movie.name
    }
    this.sendChange(data)
  },

  agreeYes: function () {
    console.log("取消支持")
    var that=this
    var params = that.data.index
    var id = params.id
    var kind = params.kind
    var tmp
    if (kind == "hot") {
      tmp=app.globalData.movies[id]
    } else {
      tmp=app.globalData.moviesHighRanks[id]
    }
    console.log(tmp)
    console.log("原态度为"+tmp.myattitude)
    if(tmp.myattitude===1){
      tmp.recommendtotal--;
      tmp.myattitude=0;
    }
    console.log("修改后态度为"+tmp.myattitude)
    if (kind == "hot") {
      app.globalData.movies[id]=tmp
    } else {
      app.globalData.moviesHighRanks[id]=tmp
    }
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 0,
      movie:tmp
    })
    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      personality: personality,
      ranks: that.data.movie.ranks,
      attitude: 0,
      name: that.data.movie.name
    }
    this.sendChange(data)
  },


  disagreeDefault: function () {
    console.log("反对")
    var that=this
    var params = that.data.index
    var id = params.id
    var kind = params.kind
    var tmp
    if (kind == "hot") {
      tmp=app.globalData.movies[id]
    } else {
      tmp=app.globalData.moviesHighRanks[id]
    }
    console.log(tmp)
    console.log("原态度为"+tmp.myattitude)
    if(tmp.myattitude==0){
      tmp.unrecommendtotal++;
      tmp.myattitude=-1;
    }else if(tmp.myattitude==1){
      tmp.recommendtotal--;
      tmp.unrecommendtotal++;
      tmp.myattitude=-1;
    }
    console.log("修改后态度为"+tmp.myattitude)
    if (kind == "hot") {
      app.globalData.movies[id]=tmp
    } else {
      app.globalData.moviesHighRanks[id]=tmp
    }
    
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 1,
      movie:tmp
    })

    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      personality: personality,
      ranks: that.data.movie.ranks,
      attitude: -1,
      name: that.data.movie.name
    }
    this.sendChange(data)

  },

  disagreeNo: function () {
    console.log("取消反对")
    var that=this
    var params = that.data.index
    var id = params.id
    var kind = params.kind
    var tmp
    if (kind == "hot") {
      tmp=app.globalData.movies[id]
    } else {
      tmp=app.globalData.moviesHighRanks[id]
    }
    console.log(tmp)
    console.log("原态度为"+tmp.myattitude)
    if(tmp.myattitude==-1){
      tmp.unrecommendtotal--;
      tmp.myattitude=0;
    }
    console.log("修改后态度为"+tmp.myattitude)
    if (kind == "hot") {
      app.globalData.movies[id]=tmp
    } else {
      app.globalData.moviesHighRanks[id]=tmp
    }
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 0,
      movie:tmp
    })
    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      personality: personality,
      ranks: that.data.movie.ranks,
      attitude: 0,
      name: that.data.movie.name
    }
    this.sendChange(data)

  },
  sendChange: function (data) {
    console.log("发送改变态度消息")
    console.log(data)
    var that = this;
    var url = app.globalData.url + '/recom/attitude/movie'
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (error) {}
    })
  },

  initChartData: function name(params) {
    var rate = [];
    for (var x in params) {
      if (x.split(":")[0].length == 4 && x.split(":")[0] != "type" && x.split(":")[0] != "info" && x.split(":")[0] != "name") {
        var p = x.split(":")[0]
        var t = this.getNumber(p, params)
        var tmp = {
          name: x.split(":")[0],
          value: t
        }
        rate.push(tmp)
      }
    }
    var data = {
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['20%', '40%'],
        data: rate
      }]
    };
    var rate2 = [];
    for (var x in params) {
      if (x.split(":")[0].length == 6) {
        var p = x.split(":")[0]
        var t = this.getNumber(p, params)
        var tmp = {
          name: x.split(":")[0],
          value: t
        }
        rate2.push(tmp)
      }
    }
    var data2 = {
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['20%', '40%'],
        data: rate2
      }]
    };
    this.setData({
      option: data,
      option2: data2
    })

  },
  initChart: function (canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
    var that = this
    var option = that.data.option;
    chart.setOption(option);
    return chart;
  },
  initChart2: function (canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
    var that = this
    var option2 = that.data.option2;
    chart.setOption(option2);
    return chart;
  },


  splitMovieInfo: function (data) {
    var tmp1 = data.split("\n");
    var tmp2 = tmp1[9].split(":")[1].split("/")
    var pattern1 = new RegExp("[A-Za-z]+");
    var otherName
    for (var x = 0; x < tmp2.length; x++) {
      if (this.isLetters(tmp2[x])) {
        otherName = tmp2[x];
        break;
      }
    }
    var result = {
      director: tmp1[0].split(":")[1],
      screenWriter: tmp1[1].split(":")[1],
      actors: tmp1[2].split(":")[1],
      movieType: tmp1[3].split(":")[1],
      movieCountry: tmp1[5].split(":")[1],
      movieLanguage: tmp1[6].split(":")[1],
      firstTime: tmp1[7].split(":")[1],
      totalTime: tmp1[8].split(":")[1],
      otherName: otherName
    }
    return result;
  },
  isLetters: function (str) {
    var re = /^[A-Za-z]+$/;
    if (str.match(re) == null)
      return false;
    else
      return true;
  },
  getDesc60Words(desc) {
    return desc.substr(0, 60) + '...';
  },
  showDescFullWords() {
    this.setData({
      showDescFull: true,
      flag: true
    });
  },
  unshowDescFullWords() {
    this.setData({
      showDescFull: false
    });
    this.setData({
      flag: false
    });
  },
  showDescFullWords1() {
    this.setData({
      showDescFull1: true,
      flag1: true
    });
  },
  unshowDescFullWords1() {
    this.setData({
      showDescFull1: false
    });
    this.setData({
      flag1: false
    });
  },
  showDescFullWords2() {
    this.setData({
      showDescFull2: true,
      flag2: true
    });
  },
  unshowDescFullWords2() {
    this.setData({
      showDescFull2: false
    });
    this.setData({
      flag2: false
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navTitle,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getNumber: function (x, params) {
    if (x == "intj") {
      return params.intj;
    }
    if (x == "intp") {
      return params.intp;
    }
    if (x == "entj") {
      return params.entj;
    }
    if (x == "entp") {
      return params.entp;
    }
    if (x == "infj") {
      return params.infj;
    }
    if (x == "infp") {
      return params.infp;
    }
    if (x == "enfj") {
      return params.enfj;
    }
    if (x == "enfp") {
      return params.enfp;
    }
    if (x == "istj") {
      return params.istj;
    }
    if (x == "isfj") {
      return params.isfj;
    }
    if (x == "estj") {
      return params.estj;
    }
    if (x == "esfj") {
      return params.esfj;
    }
    if (x == "istp") {
      return params.istp;
    }
    if (x == "isfp") {
      return params.isfp;
    }
    if (x == "estp") {
      return params.estp;
    }
    if (x == "esfp") {
      return params.esfp;
    }
    if (x == "unintj") {
      return params.unintj;
    }
    if (x == "unintp") {
      return params.unintp;
    }
    if (x == "unentj") {
      return params.unentj;
    }
    if (x == "unentp") {
      return params.unentp;
    }
    if (x == "uninfj") {
      return params.uninfj;
    }
    if (x == "uninfp") {
      return params.uninfp;
    }
    if (x == "unenfj") {
      return params.unenfj;
    }
    if (x == "unenfp") {
      return params.unenfp;
    }
    if (x == "unistj") {
      return params.unistj;
    }
    if (x == "unisfj") {
      return params.unisfj;
    }
    if (x == "unestj") {
      return params.unestj;
    }
    if (x == "unesfj") {
      return params.unesfj;
    }
    if (x == "unistp") {
      return params.unistp;
    }
    if (x == "unisfp") {
      return params.unisfp;
    }
    if (x == "unestp") {
      return params.unestp;
    }
    if (x == "unesfp") {
      return params.unesfp;
    } else {
      return 0;
    }
  },
})
const app = getApp()
import * as echarts from '../../../../components/ec-canvas/echarts';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rate1: [],
    rate2: [],
    flagChart: 1,
    id: '',
    kind: '',
    title: '热门电视推荐',
    tv: {},
    navTitle: '',
    attitudeFor: 0,
    attitudeAgainst: 0,
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
    array: ['intj-建筑师', 'intp-逻辑学家', 'entj-指挥家', 'entp-辩论家',
      'infj-提倡者', 'enfp-调停者', 'enfj-主人公', 'enfp-竞选者',
      'istj-物流师', 'isfj-守卫者', 'edtj-总经理', 'esfj执政官',
      'istp-鉴赏家', 'isfp-探险家', 'estp-企业家', 'esfp-表演者'
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var id = params.id
    var kind = params.kind
    this.setData({id:id,kind:kind})
    console.log(id)
    console.log(kind)
    var tv
    if (kind == "old") {
      tv = app.globalData.tvsHighRanks[id]
    } else {
      tv = app.globalData.tvHot[id]
    }
    console.log(tv)
    console.log("我的态度" + tv.myattitude)
    this.setData({
      tv: tv
    })

    if (tv.myattitude == 1) {
      this.setData({
        attitudeFor: 1,
        attitudeAgainst: 0
      })
    } else if (tv.myattitude == -1) {
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

    this.initChartData(tv)
    var ec = {
      onInit: this.initChart
    }
    this.setData({
      ec: ec
    })


    var tmp = this.getDesc60Words(tv.description)
    var tmp1 = tv.description
    var detailInfo = this.splitTVInfo(tv.info)
    this.setData({
      tv: tv,
      detailInfo: detailInfo
    })
    var number = parseInt(tv.description.length)
    if (number > 60) {
      this.setData({
        showDescFull: false,
        show: tmp
      })
    } else { }
  },

  bindPickerChangeTV: function (e) {
    this.setData({flagChart: 0})
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var id = e.detail.value
    var array1 = [
      'intj', 'intp', 'entj', 'entp',
      'infj', 'enfp', 'enfj', 'enfp',
      'istj', 'isfj', 'estj', 'esfj',
      'istp', 'isfp', 'estp', 'esfp'
    ]
    console.log(array1[id])

    var typeShow1 =
        ['建筑师', '逻辑学家', '指挥家', '辩论家',
          '提倡者', '调停者', '主人公', '竞选者',
          '物流师', '守卫者', '总经理', '执政官',
          '鉴赏家', '探险家', '企业家', '表演者'
        ]

    var that = this
    var rate1 = this.data.rate1
    var rate2 = this.data.rate2

    var dataShow = []
    dataShow.push(rate2[id])
    dataShow.push(rate1[id])


    var dataShowFinal = {
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['20%', '40%'],
        data: dataShow
      }]
    };

    this.setData({
      option: dataShowFinal,
    }, () => {
      console.log(dataShowFinal.series[0].data)
      console.log("重新赋值")
      var ec = {
        onInit: this.initChart
      }
      this.setData({
        ec: ec
      }, () => {
        this.setData({flagChart: 1})
      })
    })


  },


  initChartData: function name(params) {
    var rate1 = [];
    var rate2 = [];
    var array1 = [
      'intj', 'intp', 'entj', 'entp',
      'infj', 'enfp', 'enfj', 'enfp',
      'istj', 'isfj', 'estj', 'esfj',
      'istp', 'isfp', 'estp', 'esfp'
    ]

    console.log("开始赋值")
    for (var y in array1) {
      for (var x in params) {
        if (x.split(":")[0] ==array1[y]) {
          var p = x.split(":")[0]
          var t = this.getNumber(p, params)
          var tmp = {
            name: array1[y]+ " 支持者",
            value: t
          }
          rate1.push(tmp)
          var p2 = "un" + p
          var t2 = this.getNumber(p2, params)
          // console.log(p2,t2)
          var tmp2 = {
            name: array1[y] + " 反对者",
            value: t2
          }
          rate2.push(tmp2)
        }
      }

    }

    console.log(rate2)
    console.log(rate1)



    var dataShow = []
    dataShow.push(rate2[0])
    dataShow.push(rate1[0])


    var dataShowFinal = {
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['20%', '40%'],
        data: dataShow
      }]
    };

    console.log(dataShow)

    this.setData({
      rate1: rate1,
      rate2: rate2,
      option: dataShowFinal,
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


  agreeDefault: function () {
    console.log("支持")
    var that=this
    var id = that.data.id
    var kind = that.data.kind
    var tmp
    if (kind == "old") {
      tmp = app.globalData.tvsHighRanks[id]
    } else {
      tmp = app.globalData.tvHot[id]
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
    if (kind == "old") {
      app.globalData.tvsHighRanks[id]=tmp
    } else {
      app.globalData.tvHot[id]=tmp
    }
    this.setData({
      attitudeFor: 1,
      attitudeAgainst: 0,
      tv:tmp
    })

    //发送给后端
    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      personality: personality,
      ranks: that.data.tv.ranks,
      attitude: 1,
      name: that.data.tv.name
    }
    this.sendChange(data)
  },

  agreeYes: function () {
    console.log("取消支持")
    var that=this
    var id = that.data.id
    var kind = that.data.kind
    var tmp
    if (kind == "old") {
      tmp = app.globalData.tvsHighRanks[id]
    } else {
      tmp = app.globalData.tvHot[id]
    }
    console.log(tmp)
    console.log("原态度为"+tmp.myattitude)
    if(tmp.myattitude===1){
      tmp.recommendtotal--;
      tmp.myattitude=0;
    }
    console.log("修改后态度为"+tmp.myattitude)
    if (kind == "old") {
      app.globalData.tvsHighRanks[id]=tmp
    } else {
      app.globalData.tvHot[id]=tmp
    }
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 0,
      tv:tmp
    })

    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      personality: personality,
      ranks: that.data.tv.ranks,
      attitude: 0,
      name: that.data.tv.name
    }
    this.sendChange(data)
  },

  disagreeDefault: function () {
    console.log("反对")
    var that=this
    var id = that.data.id
    var kind = that.data.kind
    var tmp
    if (kind == "old") {
      tmp = app.globalData.tvsHighRanks[id]
    } else {
      tmp = app.globalData.tvHot[id]
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
    if (kind == "old") {
      app.globalData.tvsHighRanks[id]=tmp
    } else {
      app.globalData.tvHot[id]=tmp
    }
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 1,
      tv:tmp
    })

    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      personality: personality,
      ranks: that.data.tv.ranks,
      attitude: -1,
      name: that.data.tv.name
    }
    this.sendChange(data)

  },

  disagreeNo: function () {
    console.log("取消反对")
    var that=this
    var id = that.data.id
    var kind = that.data.kind
    var tmp
    if (kind == "old") {
      tmp = app.globalData.tvsHighRanks[id]
    } else {
      tmp = app.globalData.tvHot[id]
    }
    console.log(tmp)
    console.log("原态度为"+tmp.myattitude)
    if(tmp.myattitude==-1){
      tmp.unrecommendtotal--;
      tmp.myattitude=0;
    }
    console.log("修改后态度为"+tmp.myattitude)
    if (kind == "old") {
      app.globalData.tvsHighRanks[id]=tmp
    } else {
      app.globalData.tvHot[id]=tmp
    }
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 0,
      tv:tmp
    })
    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      personality: personality,
      ranks: that.data.tv.ranks,
      attitude: 0,
      name: that.data.tv.name
    }
    this.sendChange(data)

  },

  sendChange: function (data) {
    console.log("发送改变态度消息")
    console.log(data)
    var that = this;
    var url = app.globalData.url + '/recom/attitude/tv'
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



  splitTVInfo: function (data) {
    var tmp1 = data.split("\n");
    var tmp2 
    if(tmp1[0].split(":")[0] == "主演"){
       tmp2 = tmp1[9].split(":")[1].split("/")
    }else if(tmp1[11]!=""){
        tmp2=tmp1[11].split(":")[1].split("/")
    }else{
        tmp2=":"
    }
    
    var pattern1 = new RegExp("[A-Za-z]+");
    var otherName
    for (var x = 0; x < tmp2.length; x++) {
      if (this.isLetters(tmp2[x])) {
        otherName = tmp2[x];
        break;
      }
    }
    var result
    
    if (tmp1[0].split(":")[0] == "主演") {
      for(var x in tmp1){
        if(x==""){
          x=":"
        }
      }
      result = {
        director: "",
        screenWriter: "",
        actors: tmp1[0].split(":")[1],
        TVType: tmp1[1].split(":")[1],
        TVCountry: tmp1[3].split(":")[1],
        TVLanguage: tmp1[4].split(":")[1],
        firstTime: tmp1[5].split(":")[1],
        season: tmp1[6],
        oneSeason: tmp1[7],
        episodeTime: tmp1[10],
        otherName: otherName
      }
    } else {
      for(var x in tmp1){
        if(x==""){
          x=":"
        }
      }
      result = {
        director: tmp1[0].split(":")[1],
        screenWriter: tmp1[1].split(":")[1],
        actors: tmp1[2].split(":")[1],
        TVType: tmp1[3].split(":")[1],
        TVCountry: tmp1[5].split(":")[1],
        TVLanguage: tmp1[6].split(":")[1],
        firstTime: tmp1[7].split(":")[1],
        season: tmp1[8],
        oneSeason: tmp1[9],
        episodeTime: tmp1[10],
        otherName: otherName
      }
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
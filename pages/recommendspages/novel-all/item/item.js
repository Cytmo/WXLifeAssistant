
const app = getApp()
import * as echarts from '../../../../components/ec-canvas/echarts';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rate1: [],
    rate2: [],
    flagChart :1,
    index: {},
    attitudeFor: 0,
    attitudeAgainst: 0,
    id : '',
    kind:'',
    type: '',
    title:'',
    novel: {},
    navTitle: '',
    showDescFull: true, // 简介展开,true显示简介所有内容
    showDescFull1: false, // 简介展开,true显示简介所有内容
    desc60words: '',
    flag:false,
    flag1: false,
    show:'',
    detailInfo:'',
    ec: {},
    option: {},
    array: ['intj-建筑师', 'intp-逻辑学家', 'entj-指挥家', 'entp-辩论家',
      'infj-提倡者', 'enfp-调停者', 'enfj-主人公', 'enfp-竞选者',
      'istj-物流师', 'isfj-守卫者', 'estj-总经理', 'esfj执政官',
      'istp-鉴赏家', 'isfp-探险家', 'estp-企业家', 'esfp-表演者'
    ],
    ColorList: [
        {
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
  ]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var id=params.id
    var kind=params.kind
    console.log(id)
    console.log(kind)
    this.setData({id:id,kind:kind})

    var novel
  if(kind=="yuepiao"){
    novel=app.globalData.novelsyuepiao[id]
  }else if(kind=="recom"){
    novel=app.globalData.novelsrecom[id]
  }else if(kind=="mmyuepiao"){
    novel=app.globalData.novelsmmyuepiao[id]
  }else if(kind=="mmrecom"){
    novel=app.globalData.novelsmmrecom[id]
  }
  console.log(novel)
   console.log("我的态度" + novel.myattitude)
    this.setData({novel:novel})

    if (novel.myattitude == 1) {
      this.setData({
        attitudeFor: 1,
        attitudeAgainst: 0
      })
    } else if (novel.myattitude == -1) {
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

    this.initChartData(novel)
    var ec = {
      onInit: this.initChart
    }
    this.setData({
      ec: ec
    })

    var tmp=this.getDesc60Words(novel.introduction)
    var tmp1=novel.introduction
    var number=parseInt(novel.introduction.length)
     if(number>60){
       this.setData({showDescFull: false,show:tmp})
     }else{
     }
  },

  bindPickerChangeNovel: function (e) {
    this.setData({ flagChart: 0})
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
    },()=>{
      console.log(dataShowFinal.series[0].data)
      console.log("重新赋值")
      var ec = {
        onInit: this.initChart
      }
      this.setData({
        ec: ec
      },()=>{
        this.setData({ flagChart: 1})
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
    var array2= [
        'intj-建筑师', 'intp-逻辑学家', 'entj-指挥家', 'entp-辩论家',
      'infj-提倡者', 'enfp-调停者', 'enfj-主人公', 'enfp-竞选者',
      'istj-物流师', 'isfj-守卫者', 'estj-总经理', 'esfj执政官',
      'istp-鉴赏家', 'isfp-探险家', 'estp-企业家', 'esfp-表演者'
    ]

    console.log("开始赋值")
    for (var  y in array1){
      for (var x in params) {
        if (x.split(":")[0]==array1[y]) {
          var p = x.split(":")[0]
          var t = this.getNumber(p, params)
          // console.log(p)
          // console.log(t)    // console.log(p2,t2)
          var tmp = {
            name: array1[y]+" 支持者",
            value: t
          }
          rate1.push(tmp)
          var p2="un"+p
          var t2 = this.getNumber(p2, params)
          var tmp2 = {
            name: array1[y]+" 反对者",
            value: t2
          }
          // console.log(p2)
          // console.log(t2)
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
      devicePixelRatio: dpr
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
    if(kind=="yuepiao"){
      tmp=app.globalData.novelsyuepiao[id]
    }else if(kind=="recom"){
      tmp=app.globalData.novelsrecom[id]
    }else if(kind=="mmyuepiao"){
      tmp=app.globalData.novelsmmyuepiao[id]
    }else if(kind=="mmrecom"){
      tmp=app.globalData.novelsmmrecom[id]
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
    if(kind=="yuepiao"){
      app.globalData.novelsyuepiao[id]=tmp
    }else if(kind=="recom"){
      app.globalData.novelsrecom[id]=tmp
    }else if(kind=="mmyuepiao"){
      app.globalData.novelsmmyuepiao[id]=tmp
    }else if(kind=="mmrecom"){
      app.globalData.novelsmmrecom[id]=tmp
    }
    this.setData({
      attitudeFor: 1,
      attitudeAgainst: 0,
      novel:tmp
    })

    //发送给后端
    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      author: that.data.novel.author,
      attitude: 1,
      name: that.data.novel.name
    }
    this.sendChange(data)
  },

  agreeYes: function () {
    console.log("取消支持")
    var that=this
    var id = that.data.id
    var kind = that.data.kind
    var tmp
    if(kind=="yuepiao"){
      tmp=app.globalData.novelsyuepiao[id]
    }else if(kind=="recom"){
      tmp=app.globalData.novelsrecom[id]
    }else if(kind=="mmyuepiao"){
      tmp=app.globalData.novelsmmyuepiao[id]
    }else if(kind=="mmrecom"){
      tmp=app.globalData.novelsmmrecom[id]
    }
    console.log(tmp)
    console.log("原态度为"+tmp.myattitude)
    if(tmp.myattitude===1){
      tmp.recommendtotal--;
      tmp.myattitude=0;
    }
    console.log("修改后态度为"+tmp.myattitude)
    if(kind=="yuepiao"){
      app.globalData.novelsyuepiao[id]=tmp
    }else if(kind=="recom"){
      app.globalData.novelsrecom[id]=tmp
    }else if(kind=="mmyuepiao"){
      app.globalData.novelsmmyuepiao[id]=tmp
    }else if(kind=="mmrecom"){
      app.globalData.novelsmmrecom[id]=tmp
    }
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 0,
      novel:tmp
    })

    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      author: that.data.novel.author,
      attitude: 0,
      name: that.data.novel.name
    }
    this.sendChange(data)
  },

  disagreeDefault: function () {
    console.log("反对")
    var that=this
    var id = that.data.id
    var kind = that.data.kind
    var tmp
    if(kind=="yuepiao"){
      tmp=app.globalData.novelsyuepiao[id]
    }else if(kind=="recom"){
      tmp=app.globalData.novelsrecom[id]
    }else if(kind=="mmyuepiao"){
      tmp=app.globalData.novelsmmyuepiao[id]
    }else if(kind=="mmrecom"){
      tmp=app.globalData.novelsmmrecom[id]
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
    if(kind=="yuepiao"){
      app.globalData.novelsyuepiao[id]=tmp
    }else if(kind=="recom"){
      app.globalData.novelsrecom[id]=tmp
    }else if(kind=="mmyuepiao"){
      app.globalData.novelsmmyuepiao[id]=tmp
    }else if(kind=="mmrecom"){
      app.globalData.novelsmmrecom[id]=tmp
    }
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 1,
      novel:tmp
    })

    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      author: that.data.novel.author,
      attitude: -1,
      name: that.data.novel.name
    }
    this.sendChange(data)

  },

  disagreeNo: function () {
    console.log("取消反对")
    var that=this
    var id = that.data.id
    var kind = that.data.kind
    var tmp
    if(kind=="yuepiao"){
      tmp=app.globalData.novelsyuepiao[id]
    }else if(kind=="recom"){
      tmp=app.globalData.novelsrecom[id]
    }else if(kind=="mmyuepiao"){
      tmp=app.globalData.novelsmmyuepiao[id]
    }else if(kind=="mmrecom"){
      tmp=app.globalData.novelsmmrecom[id]
    }
    console.log(tmp)
    console.log("原态度为"+tmp.myattitude)
    if(tmp.myattitude==-1){
      tmp.unrecommendtotal--;
      tmp.myattitude=0;
    }
    console.log("修改后态度为"+tmp.myattitude)
    if(kind=="yuepiao"){
      app.globalData.novelsyuepiao[id]=tmp
    }else if(kind=="recom"){
      app.globalData.novelsrecom[id]=tmp
    }else if(kind=="mmyuepiao"){
      app.globalData.novelsmmyuepiao[id]=tmp
    }else if(kind=="mmrecom"){
      app.globalData.novelsmmrecom[id]=tmp
    }
    this.setData({
      attitudeFor: 0,
      attitudeAgainst: 0,
      novel:tmp
    })
    var that = this
    var wechatid = app.globalData.userID
    var personality = "未知"
    var data = {
      wechatid: wechatid,
      author: that.data.novel.author,
      attitude: 0,
      name: that.data.novel.name
    }
    this.sendChange(data)

  },



  sendChange: function (data) {
    console.log("发送改变态度消息")
    console.log(data)
    var that = this;
    var url = app.globalData.url + '/recom/attitude/novel'
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



  getDesc60Words(desc) {
    return desc.substr(0, 60)+'...';
  },
  showDescFullWords() {
    this.setData({ showDescFull: true , flag: true });
  },
  unshowDescFullWords() {
    this.setData({ showDescFull: false });
    this.setData({ flag: false });
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
// map/map/map.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapPosition:{},
    circles:{},
    longitude: 114.363748,
    latitude: 30.526617,
    array: ['近3天', '近7天', '近14天'],
    date:'2022-05-28',
    markers: {},
    circles: {},
    flag :0,
    showmap:1,
    showlist:0,
  },

  //改变地图展示的中心点,不改变数据
  reLocate:function(){
    this.setData({ flag: 0})
    this.setData({ flag: 1})
  },
 showList:function(){
   this.setData({showlist:1})
   this.setData({showmap:0})
 },
 showMap:function(){
  this.setData({showlist:0})
  this.setData({showmap:1})
},
swichNav: function (e) {
  var that = this;
  console.log(e.target.dataset.current)
  if (this.data.currentTab == e.target.dataset.current) {
    return false;
  } else {
    that.setData({
      currentTab: e.target.dataset.current
    })
  }
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {


    this.setData({ 
      markers:this.selectMapPositionDaysMapPosition( '近7天'),
      circles:this.selectMapPositionDaysCircle( '近7天'),
      flag: 1
    
    })
  },


//TODO: 修改数据源为特定的时间点
bindDateChange: function(e) {
  this.setData({
    date: e.detail.value
  })
  console.log("选择后的日期")
  console.log( e.detail.value)
  this.setData({ flag: 0})

  //TODO:Here
      //更改Mapposition1 和 circle1
  //调用 selectMapPositionOneDay(两个直接赋值)
  this.setData({
    markers:this.selectMapPositionOneDayMapPosition( e.detail.value),
    circles:this.selectMapPositionOneDayCircle( e.detail.value)
  })

  this.setData({ flag: 1})

},

//TODO: 修改数据源为特定的时间段
bindPickerChange: function(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  var id=e.detail.value
  var array1= ['近3天', '近7天', '近14天']
  console.log(array1[id])
  this.setData({
    index: e.detail.value
  })

  this.setData({ flag: 0})

  //TODO:Here 
  //更改Mapposition1 和 circle1
  //调用 selectMapPositionDays(两个直接赋值)
  this.setData({
    markers:this.selectMapPositionDaysMapPosition( array1[id]),
    circles:this.selectMapPositionDaysCircle( array1[id])
  })

  this.setData({ flag: 1})
  
},



selectMapPositionOneDayMapPosition: function (date) {
  var dates = app.globalData.mapPosition
  var result=[]
  var date1 = date
  var date2 = date
  for(var i=0;i<dates.length;i++){
    var x=dates[i].date
    if(x<=date1&&x>=date2){
      result.push(dates[i])
    }
  }
  
  return result
},
selectMapPositionDaysMapPosition: function (date) {
  var dates = app.globalData.mapPosition
  var result=[]
  var date1 = this.getFormatDate(0)
  var date2
  if(date=="近3天"){
    date2=this.getFormatDate(3)
  }else  if (date=="近7天"){
    date2=this.getFormatDate(7)
  }else  if (date=="近14天"){
    date2=this.getFormatDate(14)
  }
  for(var i=0;i<dates.length;i++){
    var x=dates[i].date
    if(x<=date1&&x>=date2){
      result.push(dates[i])
    }
  }
  console.log(result)
  return result
},

selectMapPositionOneDayCircle: function (date) {
  var dates = app.globalData.circles
  var result=[]
  var date1 = date
  var date2 = date
  for(var i=0;i<dates.length;i++){
    var x=dates[i].date
    if(x<=date1&&x>=date2){
      result.push(dates[i])
    }
  }
  console.log(result)
  return result
},
selectMapPositionDaysCircle: function (date) {
  var dates = app.globalData.circles
  var result=[]
  var date1 = this.getFormatDate(0)
  var date2
  if(date=="近3天"){
    date2=this.getFormatDate(3)
  }else  if (date=="近7天"){
    date2=this.getFormatDate(7)
  }else  if (date=="近14天"){
    date2=this.getFormatDate(14)
  }

  for(var i=0;i<dates.length;i++){
    var x=dates[i].date
    console.log(x)
    if(x<=date1&&x>=date2){
      result.push(dates[i])

    }
  }
 console.log(result)
  return result
},

getFormatDate: function (n) {
  var now = new Date();
  var date = new Date(now.getTime() - n* 24 * 3600 * 1000);
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentDate = date.getFullYear() + "-" + month + "-" + strDate;
  return currentDate;
},
  
  modify: function () {
    this.setData({ flag: 0})
    var positions = app.globalData.mapPosition1
    console.log(positions)
    this.setData({
      markers: positions
    })
    var circles = app.globalData.circles1 
    this.setData({
      circles: circles
    })
    this.setData({ flag: 1})
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.mapCtx = wx.createMapContext('myMap')

  },

  // getData: function (url,userID) {
  //   var that = this;
  //   wx.request({
  //     url:url,
  //     data: {
  //       //数据urlencode方式编码，变量间用&连接，再post
  //       msg:'get all position',
  //       wechatid:userID
  //     },
  //     method: 'POST',
  //     header: {
  //       'content-type':'application/json'
  //     },
  //     success: function(res) {
  //         that.procseeData(res.data)
  //     },
  //     fail: function(error) {
  //       console.log(error)
  //     }
  //   })
  // },
 
  // // 处理数据函数
  // procseeData: function(datas) {
  //   var objects = [];
  //   var objects1 = [];
  //   var cnt = 0;
    
  //   for (var idx in datas.data) {
  //     cnt++;
  //       var subject = datas.data[idx];
  //     // var title = subject.name;
  //     // if (title.length >= 10) {
  //     //   title = title.substring(0, 10) + "···";
  //     // }
  //     var temp = {
  //       id:cnt,
  //       iconPath: '../images/location.png',
  //       width: 25,
  //       height: 48,
  //       title:subject.address,
  //       city:subject.city,
  //       kind:subject.kind,
  //       latitude:subject.latitude,
  //       date:subject.dates,
  //       longitude:subject.longitude,
  //       primarykey:subject.primarykey
  //           }
  //       var temp1=
  //           {
  //             latitude: temp.latitude,
  //             longitude: temp.longitude,
  //             color: "#00000000",
  //             fillColor: "#0000ff20",
  //             strokeWidth: 0,
  //             radius: 120
  //           }
  //      var temp2=
  //           {
  //             latitude: temp.latitude,
  //             longitude: temp.longitude,
  //             color: "#00000000",
  //             fillColor: "#ff000040",
  //             strokeWidth: 0,
  //             radius: 60
  //           }
  //     objects.push(temp);
  //     objects1.push(temp2);
  //     objects1.push(temp1);

   
  //     }
  //     this.setData({
  //       mapPosition:objects,
  //       circles:objects1,
  //       mapPosition1:objects,
  //       circles1:objects1
  //     });
  //     app.globalData.mapPosition=objects;
  //     app.globalData.circles=objects1;
  //     app.globalData.mapPosition1=objects;
  //     app.globalData.circles1=objects1;
  //     //console.log(app.globalData.mapPosition1);
  //     // console.log(readyData);
    

  // }
  // ,

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
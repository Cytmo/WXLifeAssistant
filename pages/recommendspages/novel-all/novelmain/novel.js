// novel/novelmain/novel.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    novelsyuepiao:{},
    novelsrecom:{},
    novelsmmyuepiao:{},
    novelsmmrecom:{},
    boardItems: [
      {
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
    ]
  },

  gotoyuepiao:function (){

    wx.navigateTo({
      url: '../list/list?type=yuepiao',
    })
    
  },
  gotorecom:function (){

    wx.navigateTo({
      url: '../list/list?type=recom',
    })
    
  },
  onItemClick: function (event) {
    var kind = event.target.dataset.type;

    wx.navigateTo({
      url: '../item/item?&id=0'+'&kind='+kind
    })
  },
  gotommyuepiao:function (){

    wx.navigateTo({
      url: '../list/list?type=mmyuepiao',
    })
    
  },
  gotommrecom:function (){

    wx.navigateTo({
      url: '../list/list?type=mmrecom',
    })
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
        msg:'movie',
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
    var objects1 = [];
    var objects2 =[];
    var objects3 =[];
    var objects4 =[];
    var cnt = 0;
    for (var idx in datas.data) {
      cnt++;
      if(cnt <=10){

      var subject = datas.data[idx];
      var title = subject.name;
      if (title.length >= 10) {
        title = title.substring(0, 10) + "···";
      }
      var attitude;
      switch(subject.myattitude){
        case 1: 
          attitude="推荐";
          break;
          case 0: 
          attitude="暂无";
          break;
          case -1: 
          attitude="不推荐";
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
        completionstatus: subject.completionstatus
      }

     
      objects1.push(temp);
      this.setData({novelsyuepiao:objects1});
      app.globalData.novelsyuepiao=objects1;
      // console.log(readyData);
      }
      else if(cnt<=20){
      var subject = datas.data[idx];
      var title = subject.name;
      if (title.length >= 10) {
        title = title.substring(0, 10) + "···";
      }
      var attitude;
      switch(subject.myattitude){
        case 1: 
          attitude="推荐";
          break;
          case 0: 
          attitude="暂无";
          break;
          case -1: 
          attitude="不推荐";
          break;
          // default:
          //   attitude="暂无"
      }
      var attitude;
      switch(subject.myattitude){
        case 1: 
          attitude="推荐";
          break;
          case 0: 
          attitude="暂无";
          break;
          case -1: 
          attitude="不推荐";
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
        completionstatus: subject.completionstatus
      }
      objects2.push(temp);
      // var readyData = {};
      // readyData = {
      //   objects: objects,
      // }
      // 数据绑定
      this.setData({novelsrecom:objects2});
      app.globalData.novelsrecom=objects2;
      // console.log(readyData);
    }else if(cnt<=30){
      var subject = datas.data[idx];
      var title = subject.name;
      if (title.length >= 10) {
        title = title.substring(0, 10) + "···";
      }
      var attitude;
      switch(subject.myattitude){
        case 1: 
          attitude="推荐";
          break;
          case 0: 
          attitude="暂无";
          break;
          case -1: 
          attitude="不推荐";
          break;
          // default:
          //   attitude="暂无"
      }
      var attitude;
      switch(subject.myattitude){
        case 1: 
          attitude="推荐";
          break;
          case 0: 
          attitude="暂无";
          break;
          case -1: 
          attitude="不推荐";
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
        completionstatus: subject.completionstatus
      }
      objects3.push(temp);
      // var readyData = {};
      // readyData = {
      //   objects: objects,
      // }
      // 数据绑定
      this.setData({novelsmmyuepiao:objects3});
      app.globalData.novelsmmyuepiao=objects3;
      // console.log(readyData);
    }
    else if(cnt<=40){
      var subject = datas.data[idx];
      var title = subject.name;
      if (title.length >= 10) {
        title = title.substring(0, 10) + "···";
      }
      var attitude;
      switch(subject.myattitude){
        case 1: 
          attitude="推荐";
          break;
          case 0: 
          attitude="暂无";
          break;
          case -1: 
          attitude="不推荐";
          break;
          // default:
          //   attitude="暂无"
      }
      var attitude;
      switch(subject.myattitude){
        case 1: 
          attitude="推荐";
          break;
          case 0: 
          attitude="暂无";
          break;
          case -1: 
          attitude="不推荐";
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
        completionstatus: subject.completionstatus
      }
      objects4.push(temp);
      // var readyData = {};
      // readyData = {
      //   objects: objects,
      // }
      // 数据绑定
      this.setData({novelsmmrecom:objects4});
      app.globalData.novelsmmrecom=objects4;
      // console.log(readyData);
    }
    //console.log(objects);
  }
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
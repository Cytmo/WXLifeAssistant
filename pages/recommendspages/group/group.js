// pages/recommendspages/group/group.js
const app = getApp()
var ipv4 = "http://10.131.148.225:8081"
Page({
  data: {
    openId: null,
    currentIndexNav: 0,
    canshow: false,
    navList: [
      {'index':0,'text':'遇见'},
      {'index':1,'text':'探寻'},
      {'index':2,'text':'全览'},
      {'index':3,'text':'自我'}
    ],

    nowId : 0,
    uploadDocList: [],
    randomList:[],
    searchList:[],
    allList:[],
    myList:[],
    triggered: false,

    showGroup:{},
    showGroupTag:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(params) {
    if(params.pageid == 0){
      var sendUrl = ipv4 + "/group/randomList"
      this.getRandomListData(sendUrl)
    }else{
      this.setData({
        canshow : true,
        currentIndexNav : 3
      })
      this.getMyList()
    }
    
  },

  getRandomListData: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'post',
      header: {
        'content-type': 'application/json' // 豆瓣一定不能是json
      },
      success: function(res) {
        that.setData({
          randomList : res.data.data,
          canshow : true,
          triggered: false
        })
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          canshow : false,
          triggered: false
        })
      }
    })
  },

  onScrollRefresh1: function () {
    var sendUrl = ipv4 + "/group/randomList"
    this.getRandomListData(sendUrl)
  },

  switchPage:function(event){
    var to_index = event.target.dataset.index
    // console.log(to_index)
    this.setData({
      currentIndexNav: to_index,
      canshow: false
    })
    let that = this;
    switch (that.data.currentIndexNav) {
      case 0:
        var sendUrl = ipv4 + "/group/randomList"
        that.getRandomListData(sendUrl)
        break;
      case 1:
        that.setData({
          canshow : true
        })
        break;
      case 2:
        that.setData({
          nowId:0,
          allList:[]
        })
        that.addAll()
        break;
      case 3:
        that.setData({
          canshow : true
        })
        that.getMyList()
        break
      default:
        break;
    }
  },

  showDetailsR:function(event){
    console.log(event.target.dataset.recordid)
    var idShow = event.target.dataset.recordid
    this.data.randomList.forEach(element => {
      if(element.groupId == idShow){
        this.setData({
          showGroup : element,
          showGroupTag : true
        })
      }
    });
  },

  showDetailsS:function(event){
    console.log(event.target.dataset.recordid)
    var idShow = event.target.dataset.recordid
    this.data.searchList.forEach(element => {
      if(element.groupId == idShow){
        this.setData({
          showGroup : element,
          showGroupTag : true
        })
      }
    });
  },

  showDetailsA:function(event){
    console.log(event.target.dataset.recordid)
    var idShow = event.target.dataset.recordid
    this.data.allList.forEach(element => {
      if(element.groupId == idShow){
        this.setData({
          showGroup : element,
          showGroupTag : true
        })
      }
    });
  },

  showDetailsM:function(event){
    console.log(event.target.dataset.recordid)
    var idShow = event.target.dataset.recordid
    this.data.myList.forEach(element => {
      if(element.groupId == idShow){
        this.setData({
          showGroup : element,
          showGroupTag : true
        })
      }
    });
  },

  closeShow:function(){
    this.setData({
      showGroup : {},
      showGroupTag : false
    })
  },


  showDetails:function(id){

  },

  groupSearch:function(e){
    var name = e.detail.value.content
    var that = this;
    var searchUrl = ipv4 + "/group/find"
    wx.request({
      url: searchUrl,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data:{
        name:name
      },
      success: function(res) {
        that.setData({
          searchList : res.data.data,
          canshow : true,
        })
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          canshow : false,
        })
      }
    })
  },

  addAll:function(){
    var sendUrl = ipv4 + "/group/list"
    var that = this;

    wx.request({
      url: sendUrl,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data:{
        id:that.data.nowId
      },
      success: function(res) {
        let tempList = that.data.allList
        tempList = tempList.concat(res.data.data)
        that.setData({
          allList : tempList,
          canshow : true,
          nowId : tempList[tempList.length - 1].groupId
        })
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          allList:[],
          nowId : 0,
          canshow : false
        })
      }
    })
  },

  getMyList : function(){
    var userId = app.globalData.userID
    console.log(userId)
    var that = this; 
    var searchUrl = ipv4 + "/user/findGroup"
    wx.request({
      url: searchUrl,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data:{
        userId:userId
      },
      success: function(res) {
        that.setData({
          myList : res.data.data
        })
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  addNew:function(){
    wx.navigateTo({
      url: '../addGroup/addGroup'
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

  }


})
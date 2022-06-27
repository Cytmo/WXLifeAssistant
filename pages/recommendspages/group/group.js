// pages/recommendspages/group/group.js
import { $init, $digest } from '../../../utils/common'
const app = getApp()
//直接在app.js中修改!!
var ipv4 = app.globalData.url
// var ipv4 = "http://localhost:8081"


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
    showGroupTag:false,
    scrollHeight : 200
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(params) {

    $init(this)
    let  scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight
    });
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
    var urln = ipv4 + "/group/image?groupId=" + idShow
    var that = this
    
    this.data.randomList.forEach(element => {
      if(element.groupId == idShow){
        if(element.qrCode.split(":")[0]!="http"){
          wx.downloadFile({
            url: urln, //仅为示例，并非真实的资源
            header: {
              'content-type': 'application/json' 
            },
            success (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              console.log(res);
              element.qrCode = res.tempFilePath
              that.setData({
                showGroup : element,
                showGroupTag : true
              })
            }
            
          })
        }else{
          that.setData({
            showGroup : element,
            showGroupTag : true
          })
        }
      }
    });
    $digest(this)
  },

  showDetailsS:function(event){
    console.log(event.target.dataset.recordid)
    var idShow = event.target.dataset.recordid
    var urln = ipv4 + "/group/image?groupId=" + idShow
    var that = this
    
    this.data.searchList.forEach(element => {
      if(element.groupId == idShow){
        if(element.qrCode.split(":")[0]!="http"){
          wx.downloadFile({
            url: urln, //仅为示例，并非真实的资源
            header: {
              'content-type': 'application/json' 
            },
            success (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              console.log(res);
              element.qrCode = res.tempFilePath
              that.setData({
                showGroup : element,
                showGroupTag : true
              })
            }
            
          })
        }else{
          that.setData({
            showGroup : element,
            showGroupTag : true
          })
        }
      }
    });
    $digest(this)
  },

  preview(){
    var that = this;
    wx.previewImage({
      urls: [that.data.showGroup.qrCode]
    })
  },

  showDetailsA:function(event){
    console.log(event.target.dataset.recordid)
    var idShow = event.target.dataset.recordid
    var urln = ipv4 + "/group/image?groupId=" + idShow
    var that = this
    
    this.data.allList.forEach(element => {
      if(element.groupId == idShow){
        if(element.qrCode.split(":")[0]!="http"){
          wx.downloadFile({
            url: urln, //仅为示例，并非真实的资源
            header: {
              'content-type': 'application/json' 
            },
            success (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              console.log(res);
              element.qrCode = res.tempFilePath
              that.setData({
                showGroup : element,
                showGroupTag : true
              })
            }
            
          })
        }else{
          that.setData({
            showGroup : element,
            showGroupTag : true
          })
        }
      }
    });
    $digest(this)
  },

  showDetailsM:function(event){
    console.log(event.target.dataset.recordid)
    var idShow = event.target.dataset.recordid
    var urln = ipv4 + "/group/image?groupId=" + idShow
    var that = this
    
    this.data.myList.forEach(element => {
      if(element.groupId == idShow){
        if(element.qrCode.split(":")[0]!="http"){
          wx.downloadFile({
            url: urln, //仅为示例，并非真实的资源
            header: {
              'content-type': 'application/json' 
            },
            success (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              console.log(res);
              element.qrCode = res.tempFilePath
              that.setData({
                showGroup : element,
                showGroupTag : true
              })
            }
            
          })
        }else{
          that.setData({
            showGroup : element,
            showGroupTag : true
          })
        }
      }
    });
    $digest(this)
    
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
    wx.showLoading({
      title: '正在查询...',
      mask: true
    })
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
        wx.hideLoading()
        loadSuccess()
        
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          canshow : false,
        })
        wx.hideLoading()
        
      }
    })
  },

  addAll:function(){
    var sendUrl = ipv4 + "/group/list"
    var that = this;
    console.log(that.data.nowId)

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
        if(tempList.length !=0 ){
          that.setData({
            allList : tempList,
            canshow : true,
            nowId : tempList[tempList.length - 1].groupId
          })
        }
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
    var userId = app.globalData.userId
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

  loadSuccess:function(){
    wx.showToast({
      title: '操作成功',
      mask : true,
      icon: 'none',
      duration: 1000//持续的时间
    })
  },

  loadFailed:function(msg){
    wx.showToast({
      title: msg,
      mask : true,
      icon: 'none',
      duration: 2000//持续的时间
    })
  },

  deleteGroup:function(event){
    var id = event.target.dataset.recordid
    console.log(event)
    var that = this;
    var searchUrl = ipv4 + "/group/deletebyid"
    wx.showLoading({
      title: '正在删除...',
      mask: true
    })
    wx.request({
      url: searchUrl,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data:{
        groupId:id
      },
      success: function(res) {
        wx.hideLoading()
        that.loadSuccess()
        that.getMyList()
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          canshow : false,
        })
        wx.hideLoading()
        
      }
    })
  },
  //阻止事件穿透背景层
  preventD(){

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
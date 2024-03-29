var util = require('../../../../utils/util.js');
var th = require('../../../../utils/throttle/throttle.js');
import   '../../../../utils/util.js';
import { formatTime,formatDate } from '../../../../utils/common'
import {loadSuccess,loadFailed,handleRes} from '../../../../utils/czutils'
var avoidPreviewImageOnShow; //避免预览图片后，触发onShow函数
// var ipv4 = "http://localhost:80"
const app = getApp()
var ipv4 = app.globalData.url
// var ipv4 = app.globalData.url
//index.js

Page({
  data: {
    openId: null,
    userId: 0,
    currentIndexNav: 0,
    canshow: false,
    navList: [
      {'index':0,'text':'树洞广场'},
      {'index':1,'text':'我的树洞'}
    ],
    uploadDocList: [],
    isFirstIndex:true,
    hollowList:[],
    myhollowList:[],

    currentTime:null,
    mycurrentTime:null,
    triggered: false,
    scrollHeight : 200,

    against:null,
    hollownameset:null,
    headImage:["https://img2.woyaogexing.com/2022/06/27/02c6eea9b2b9af34!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/27/1e9cf0147d4a23d9!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/27/57696ee7e83b976b!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/26/1080cc26f5fc3b3f!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/26/6d019b8dc2ff0222!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/25/f1c65f91de8c977b!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/25/be9df2afb66ebd1c!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/23/00c4153f4f06fa63!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/21/4cacc77b103fd157!400x400.jpg",
    "https://img2.woyaogexing.com/2022/06/21/393892e08a17a77c!400x400.jpg"]

  },

  onLoad: function() {
  //   var that =this
  //   wx.getStorage({
  //     key:'token',
  //     success(res){
  //       console.log("成功读取本地token")
  //       console.log(res.data)
  //       var token = res.data
  //       that.setData({
  //         token:res.data
  //       },()=>{
  //         that.userId = app.globalData.userId
  //       })

  //   },
  //   fail(res){
  //       wx.showToast({
  //         title: '请先登录',
  //         icon:"error",
  //         duration:2000
  //       })
  //       wx.setStorageSync('ifShowWarn',1)
  //         wx.switchTab({
            
  //           url: '/pages/user/user',
  //         })
        
  //   }
  // })
    let  scrollHeight = wx.getSystemInfoSync().windowHeight;
    console.log("idyuan:"+app.globalData.userId)
    this.setData({
      hollowList:[],
      scrollHeight: scrollHeight,
      userId:app.globalData.userId
    });

    if(app.globalData.userId){
      // showMessage(app.globalData.userID);
      this.setData({
        userId:app.globalData.userId
      })
    }else{
      // 跳转登录
      app.openIdReadyCallback = res => {
        //开启未读消息自动刷新
        showMessage(res.result.openid);
        this.setData({
          openId: res.result.openid
        });
      }
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("begin to show")
    this.setData({
      hollowList:[],
      myhollowList:[],
      currentTime :formatTime(new Date())
    })
    this.getHollowList(formatTime(new Date()))
  },

  onReady:function(){
    this.against = this.selectComponent("#against")
    this.hollownameset = this.selectComponent("#hollownameset")
    var that = this;
    console.log("是否有树洞昵称：" + app.globalData.userInformation.hollow_name)
    if(app.globalData.userInformation.hollow_name == null || app.globalData.userInformation.hollow_name == ""){
      console.log("进入到树洞的昵称填写阶段")
      that.hollownameset.setId(app.globalData.userId)
      that.hollownameset.toShow()
    }
  },

  getHollowList:function(time){
    var that = this
    var urlsend = ipv4 + "/hollow/getHollowList"

    console.log("begin to get")
    console.log("id:"+that.data.userId)

    wx.request({
      url: urlsend,
      method: 'post',
      header: {
        'content-type': 'application/json' // 豆瓣一定不能是json
      },
      data:{
        time : time,
        userId : that.data.userId
      },
      success: function(res) {
        console.log(res.data)
        var tempList = res.data.data
        if(tempList.length != 0){
          tempList = that.data.hollowList.concat(tempList)
          that.setData({
            hollowList:tempList,
            currentTime:tempList[tempList.length-1].time,
            canshow:true,
            triggered: false
          })
        }else{
          that.setData({
            triggered: false
          })
        }
        
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          hollowList:[],
          canshow : false,
          triggered: false
        })
      }
    })
  },

  getMyList:function(time){
    var that = this
    var urlsend = ipv4 + "/hollow/myHollowList"

    console.log("begin to get")

    wx.request({
      url: urlsend,
      method: 'post',
      header: {
        'content-type': 'application/json' // 豆瓣一定不能是json
      },
      data:{
        time : time,
        userId : that.data.userId
      },
      success: function(res) {
        console.log(res.data)
        var tempList = res.data.data
        if(tempList.length != 0){
          tempList = that.data.myhollowList.concat(tempList)
          that.setData({
            myhollowList:tempList,
            mycurrentTime:tempList[tempList.length-1].time,
            canshow:true,
            triggered: false
          })
        }else{
          that.setData({
            triggered: false
          })
        }
        
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          hollowList:[],
          canshow : false,
          triggered: false
        })
      }
    })
  },
  

  

  onPullDownRefresh: function () {
    //下拉刷新记录列表
    this.setData({
      currentTime :formatTime(new Date()),
      mycurrentTime:formatTime(new Date()),
      hollowList:[],
      myhollowList:[]
    })
    if(this.data.currentIndexNav == 0){
      this.getHollowList(this.data.currentTime)
    }else{
      this.getMyList(this.data.mycurrentTime)
    }
    //停止下拉刷新
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    if (this.data.currentIndexNav == 0){
      this.getHollowList(this.data.currentTime)
    } else {
      const openId = this.data.openId;
      this.getMyList(this.data.mycurrentTime)
    }
    
  },
  
  

  activeNav: function(e) {
    this.setData({
      currentIndexNav: e.target.dataset.index,
      canshow: false
    })
    if (this.data.currentIndexNav == 0) {
      this.setData({
        currentTime :formatTime(new Date()),
        hollowList : []
      })
      this.getHollowList(this.data.currentTime)
    } else {
      this.setData({
        mycurrentTime :formatTime(new Date()),
        myhollowList : []
      })
      console.log(this.data.mycurrentTime)
      this.getMyList(this.data.mycurrentTime)
    }
  },

  deleteHollow: function (event) {
    let that = this;
    //询问用户是否删除
    wx.showModal({
      title: '提示',
      content: '确定要删除记录吗？',
      success: function (res) {
        if (res.confirm) {
          //确定删除
          wx.showLoading({
            title: '删除中',
          });
          //获得记录在数据库的id
          let hollowId = event.target.dataset.id;
          let deleteUrl = ipv4 + "/hollow/deleteHollow"
          wx.request({
            url: deleteUrl,
            method: 'post',
            header: {
              'content-type': 'application/json'
            },
            data:{
              hollowId:hollowId
            },
            success: function(res) {
              wx.hideLoading()
              that.loadSuccess()
              that.setData({mycurrentTime :formatTime(new Date())})
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

        }
      }
    });
  },

  gotoTopicDetials: function (event) {
  let id = event.currentTarget.dataset.recordid
    wx.navigateTo({
      url: '/pages/expandspages/treehole/topicDetials/topicDetials?&recordid='+id
    });
  },

  onLikePublic: function (event) {
    let hollowId = event.currentTarget.dataset.id
    let urlin = ipv4 + "/hollow/support"
    this.onChangeEvent(urlin,hollowId,1,"成功点赞","赞已取消",1)
  },

  onComfortPublic:function(event){
    let hollowId = event.currentTarget.dataset.id
    let urlin = ipv4 + "/hollow/comfort"
    this.onChangeEvent(urlin,hollowId,2,"成功安慰","安慰已取消",1)
  },

  onLikePrivate: function (event) {
    let hollowId = event.currentTarget.dataset.id
    let urlin = ipv4 + "/hollow/support"
    this.onChangeEvent(urlin,hollowId,1,"成功点赞","赞已取消",2)
  },

  onComfortPrivate:function(event){
    let hollowId = event.currentTarget.dataset.id
    let urlin = ipv4 + "/hollow/comfort"
    this.onChangeEvent(urlin,hollowId,2,"成功安慰","安慰已取消",2)
  },

  onAgainst:function(event){
    let hollowId = event.currentTarget.dataset.id
    this.against.setId(this.data.userId,hollowId)
    this.against.toShow()
  },

  onChangeEvent:function(urlin,hollowId,sc,content1,content2,pp){
    let that = this;
    let userId = this.data.userId
    var tempList
    if(pp == 1){
      tempList = this.data.hollowList
    }else{
      tempList = this.data.myhollowList
    }
    
    var indexin = 0
    for (let index = 0; index < tempList.length; index++) {
      const element = tempList[index];
      if(hollowId == element.hollowId){
        indexin = index
      }
    }
    wx.request({
      url: urlin,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data:{
        hollowId:hollowId,
        userId:userId
      },
      success: function(res) {
        var result = res.data
        if(result.msg == content1){
          if(sc == 1){
            tempList[indexin].support_num = tempList[indexin].support_num + 1
          }else{
            tempList[indexin].comfort_num = tempList[indexin].comfort_num + 1
          }
          if(pp == 1){
            that.setData({
              hollowList:tempList,
              canshow : true
            })
          }else{
            that.setData({
              myhollowList:tempList,
              canshow : true
            })
          }
          loadSuccess()
        }else if(result.msg == content2){
          if(sc == 1){
            tempList[indexin].support_num = tempList[indexin].support_num - 1
          }else{
            tempList[indexin].comfort_num = tempList[indexin].comfort_num - 1
          }
          if(pp == 1){
            that.setData({
              hollowList:tempList,
              canshow : true
            })
          }else{
            that.setData({
              myhollowList:tempList,
              canshow : true
            })
          }
          loadFailed(result.msg)
        }else{
          loadFailed(result.msg)
          that.setData({
            canshow : false,
          })
        }
        
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          canshow : false,
        })
      }
    })
  },




  

  
})


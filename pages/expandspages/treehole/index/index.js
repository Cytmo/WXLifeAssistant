var util = require('../../../../utils/util.js');
var th = require('../../../../utils/throttle/throttle.js');
import   '../../../../utils/util.js';
import { formatTime,formatDate } from '../../../../utils/common'
import {loadSuccess,loadFailed,handleRes} from '../../../../utils/czutils'
var avoidPreviewImageOnShow; //避免预览图片后，触发onShow函数
var ipv4 = "http://localhost:80"
//index.js
const app = getApp()
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
    scrollHeight : 200

  },

  onLoad: function() {
    let  scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      hollowList:[],
      scrollHeight: scrollHeight
    });
    if(app.globalData.userID){
      // showMessage(app.globalData.userID);
      this.setData({
        userId:app.globalData.userID
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
    this.setData({currentTime :formatTime(new Date())})
    this.getHollowList(formatTime(new Date()))
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("begin to show")
    
    if (avoidPreviewImageOnShow) {
      avoidPreviewImageOnShow = false;
      return;
    }
  },

  getHollowList:function(time){
    var that = this
    var urlsend = ipv4 + "/hollow/getHollowList"

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
        hollowList : []
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
    let that = this;
    let hollowId = event.currentTarget.dataset.id

    let urlin = ipv4 + "/hollow/support"

    let userId = this.data.userId
    let tempList = this.data.hollowList
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
        if(result.msg == "成功点赞"){
          tempList[indexin].support_num = tempList[indexin].support_num + 1
          that.setData({
            hollowList:tempList,
            canshow : true
          })
          that.loadSuccess()
        }else if(result.msg == "赞已取消"){
          tempList[indexin].support_num = tempList[indexin].support_num - 1
          that.setData({
            hollowList:tempList,
            canshow : true
          })
          that.loadFailed(result.msg)
        }else{
          that.loadFailed(result.msg)
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

  onComfortPublic:function(){

  },

  onAgainstPublic:function(){

  },

  getOnLikePrivate: function (index, length, newDoc) {
    let that = this;
    let openId = this.data.openId;
    let id = newDoc[index]._id;
    const db = wx.cloud.database();
    db.collection("praiseDoc").where({
      clickUserId: openId,
      recordId: id
    }).count({
      success: function (res) {
        if (res.total != 0) {
          //添加喜欢键值对id:true
          let state = "onLikePrivate." + id;
          that.setData({
            [state]: true
          });
        } else {
          console.log("用户不喜欢");
          //添加不喜欢键值对id:false
          let state = "onLikePrivate." + id;
          that.setData({
            [state]: false
          });
        }
      },
      fail: function (res) {
        //获取失败,默认是不喜欢
        console.log("默认用户不喜欢");
        //添加不喜欢键值对id:true
        let state = "onLikePrivate." + id;
        that.setData({
          [state]: false
        });
      },
      complete: function (res) {
        if ((index + 1) == length) {
          //最后一个记录判断当前用户是否喜欢完成
          wx.hideLoading();
        } else {
          //否则，判断下一个记录
          index = index + 1;
          that.getOnLikePrivate(index, length, newDoc);
        }
      }
    });
  },
  

  
})

//获取未读消息，隔3秒刷新一次
function showMessage(openId) {
  const db = wx.cloud.database();
  //获得评论promise对象
  let p1 = db.collection('commentDoc').where({
    byReviewerId: openId, firstRead: true
  }).count();
  //获得点赞promise对象
  let p2 = db.collection('praiseDoc').where({
    recordUserId: openId, first: true
  }).count();
  //等待获取评论数点赞数
  Promise.all([p1, p2])
  .then((res) => {
    //赋予全局，以便message页面获取
    app.globalData.newCommentsCount = res[0].total;
    app.globalData.newThumbupCount = res[1].total;
    //更新消息tabBar
    let sum = res[0].total + res[1].total;
    if (sum == 0) {
      wx.removeTabBarBadge({
        index: 2
      });
    } else {
      wx.setTabBarBadge({
        index: 2,
        text: String(sum)
      });
    }
  }).catch((error) => {
    console.log(error)
  });
  setTimeout(function () {
    showMessage(openId);
  }, 1000);
}
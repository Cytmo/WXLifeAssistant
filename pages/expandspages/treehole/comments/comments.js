var util = require('../../../../utils/util.js');
var th = require('../../../../utils/throttle/throttle.js');
import { formatTime,formatDate } from '../../../../utils/common'
import {loadSuccess,loadFailed,handleRes} from '../../../../utils/czutils'
const app = getApp();
var ipv4 = "http://localhost:8081"
// var ipv4 = app.globalData.url
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: null,
    canshow: false,
    currentIndexNav: 0,
    navList: [
      { 'index': 0, 'text': '评论我的' }
    ],
    userInfo: null,


    replyList: [],
    replyConIdMap: null,
    currentTime:null,
    userId:0,
    triggered: false,
    scrollHeight : 200

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let  scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight,
      replyConIdMap : new Map([[0,"消息不存在"]])
    });
    if(app.globalData.userId){
      // showMessage(app.globalData.userId);
      this.setData({
        replyList:[],
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
    this.setData({currentTime :formatTime(new Date())})
    this.getReplyList(formatTime(new Date()))

  },

  getReplyList:function(time){
    var that = this
    var urlsend = ipv4 + "/user/replyHollowList"

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
        var tempList = res.data.data
        var cloneList = []
        let mapTemp = new Map(that.data.replyConIdMap)
        for (let index = 0; index < tempList.length; index++) {
          const element = tempList[index];
          if(mapTemp.has(element.reply_post_id)){
            var obadd = {firstcon:mapTemp.get(element.reply_post_id)}
            cloneList = cloneList.concat({...element,...obadd})
            that.setData({
              replyConIdMap:mapTemp
            })
          }else{
            wx.request({
              url: ipv4 + "/hollow/getHollowById",
              method: 'post',
              header: {
                'content-type': 'application/json' // 豆瓣一定不能是json
              },
              data:{
                hollowId : element.reply_post_id,
                userId : that.data.userId
              },
              success: function(res) {
                var hollow = res.data.result
                var contentHead = "内容拉取失败"
                if(hollow.content.length > 20){
                  contentHead = hollow.content.substring(0,20) + "..."
                }else{
                  contentHead = hollow.content
                }
                mapTemp.set(hollow.hollowId,contentHead)
                var obadd = {firstcon:mapTemp.get(element.reply_post_id)}
                cloneList = cloneList.concat({...element,...obadd})
                that.setData({
                  replyList:cloneList,
                  replyConIdMap:mapTemp,
                  canshow:true,
                  triggered: false
                })
              },
              fail: function(error) {
                that.setData({
                  triggered:false
                })
                console.log(error)
              }
            })
          }
        }
        if(cloneList.length != 0){
          that.setData({
            replyList:cloneList,
            currentTime:cloneList[cloneList.length-1].time,
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
          replyList:[],
          canshow : false,
          triggered: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.changeUnread();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      currentTime :formatTime(new Date()),
      replyList:[]
    })
    //下拉刷新记录列表
    this.getReplyList(formatTime(new Date()))
    //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getReplyList(this.data.currentTime)
  },

  changeState:function(hollowId){
    var that = this
    var urlsend = ipv4 + "/user/finishReplyHollow"
    wx.request({
      url: urlsend,
      method: 'post',
      header: {
        'content-type': 'application/json' // 豆瓣一定不能是json
      },
      data:{
        hollowId : hollowId,
        userId : that.data.userId
      },
      success: function(res) {
        if(res.data.code == 0){
          loadSuccess()
          return 0
        }else{
          loadFailed(res.data.msg)
          return 1
        }
        
      },
      fail: function(error) {
        console.log(error)
        return 1
      }
    })



  },

  gotoTopicDetials: function (event) {
    console.log(event)
    let id = event.currentTarget.dataset.recordid
    let hollowId = event.currentTarget.dataset.hollowid
    var result = this.changeState(hollowId)
    var tempList = this.data.replyList
    var deleteIndex 
    if(result == 0){
      for (let index = 0; index < tempList.length; index++) {
        const element = tempList[index];
        if(element.hollowId == hollowId){
          deleteIndex = index
          break
        }
      }
      let removedList = tempList.splice(deleteIndex, 1)
      this.setData({
        replyList:removedList
      })
    }
    wx.navigateTo({
      url: '/pages/expandspages/treehole/topicDetials/topicDetials?&recordid='+id
    });
  }

})
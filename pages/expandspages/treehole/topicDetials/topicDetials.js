var util = require('../../../../utils/util.js');
var th = require('../../../../utils/throttle/throttle.js');
import { formatTime,formatDate } from '../../../../utils/common'
import {loadSuccess,loadFailed,handleRes} from '../../../../utils/czutils'
const app = getApp()

var ipv4 = app.globalData.url

Page({
  data: {
    userId : 0,
    commentList: [],
    contentdetail: Object,
    currentTime:null,
    replyId:0,
    focus:false,
    replyto:"友善的评论是交流的起点",
    triggered:false,
    scrollHeight : 200,

    openId: null,
    
    recordId: '',
    jumpflag: false,
    byRevInfo: {},
    
    mainTopicComm: Object, //对主题贴的评论
    replyComm: {}, //记录被回复评论的信息
    commnNum: 0,
    pageIndex: 1,
    pageSize: 5,
    pageCount: 0,
    total: 0,
    onLikePublic: null,
    childId:'',
    parentId:''
  },

  onLoad: function(options) {
    let  scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({scrollHeight: scrollHeight});
    console.log(options)
    var hollowId = options.recordid
    this.setData.replyId = options.recordid
    if(app.globalData.userID){
      // showMessage(app.globalData.userID);
      this.setData({
        userId:app.globalData.userID
      })
    }else{
      // 跳转登录
      app.openIdReadyCallback = res => {
        //开启未读消息自动刷新
        // showMessage(res.result.openid);
        this.setData({
          openId: res.result.openid
        });
      }
    }
    this.showHollow(hollowId,true)
  },

  showHollow:function(hollowId,ifLoad){
    var urlin = ipv4 + "/hollow/getHollowById"
    var that = this
    wx.request({
      url: urlin,
      method: 'post',
      header: {
        'content-type': 'application/json' // 豆瓣一定不能是json
      },
      data:{
        hollowId : hollowId,
        userId : that.data.userId
      },
      success: function(res) {
        console.log(res.data)
        var hollow = res.data.result
        that.setData({
          contentdetail : hollow,
          triggered: false
        })
        if(ifLoad){
          that.setData({
            currentTime :formatTime(new Date())
          })
          that.getCommentList()
        }
      },
      fail: function(error) {
        that.setData({
          triggered: false
        })
        console.log(error)
        loadFailed("无法加载")
        wx.navigateBack({})
      }
    })
  },

  getCommentList:function(){
    var time = this.data.currentTime
    var userId = this.data.userId
    var under_post_id = this.data.contentdetail.hollowId
    var urlin = ipv4 + "/hollow/getHollowList/below"
    var that = this
    wx.request({
      url: urlin,
      method: 'post',
      header: {
        'content-type': 'application/json' // 豆瓣一定不能是json
      },
      data:{
        time:time,
        userId:userId,
        under_post_id:under_post_id
      },
      success: function(res) {
        handleRes(res)
        if(res.data.code == 0){
          var tempList = res.data.data
          if(tempList.length != 0){
            tempList = that.data.commentList.concat(tempList)
            that.setData({
              commentList:tempList,
              currentTime:tempList[tempList.length-1].time,
              triggered: false
            })
          }else{
            that.setData({
              triggered: false
            })
          }
        }
      },
      fail: function(error) {
        console.log(error)
        loadFailed("无法加载")
        wx.navigateBack({})
      }
    })


  },

  onLikePublic: function (event) {
    let hollowId = event.currentTarget.dataset.id
    let urlin = ipv4 + "/hollow/support"
    this.onChangeEventList(urlin,hollowId,1,"成功点赞","赞已取消")
  },

  onComfortPublic:function(event){
    let hollowId = event.currentTarget.dataset.id
    let urlin = ipv4 + "/hollow/comfort"
    this.onChangeEventList(urlin,hollowId,2,"成功安慰","安慰已取消")
  },

  onAgainstPublic:function(){},
  
  onChangeEventList:function(urlin,hollowId,sc,content1,content2){
    let that = this;
    let userId = this.data.userId
    var tempList = this.data.commentList
    
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
          that.setData({
            commentList:tempList
          })
          loadSuccess()
        }else if(result.msg == content2){
          if(sc == 1){
            tempList[indexin].support_num = tempList[indexin].support_num - 1
          }else{
            tempList[indexin].comfort_num = tempList[indexin].comfort_num - 1
          }
          that.setData({
            commentList:tempList
          })
          loadFailed(result.msg)
        }else{
          loadFailed(result.msg)
        }
        
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  onLikeHead: function () {
    let urlin = ipv4 + "/hollow/support"
    this.onChangeEventHead(urlin,1,"成功点赞","赞已取消")
  },

  onComfortHead:function(){
    let urlin = ipv4 + "/hollow/comfort"
    this.onChangeEventHead(urlin,2,"成功安慰","安慰已取消")
  },

  onChangeEventHead:function(urlin,sc,content1,content2){
    let that = this;
    let userId = this.data.userId
    var temp = this.data.contentdetail
    wx.request({
      url: urlin,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data:{
        hollowId:temp.hollowId,
        userId:userId
      },
      success: function(res) {
        var result = res.data
        if(result.msg == content1){
          if(sc == 1){
            temp.support_num = temp.support_num + 1
          }else{
            temp.comfort_num = temp.comfort_num + 1
          }
          that.setData({
            contentdetail:temp
          })
          loadSuccess()
        }else if(result.msg == content2){
          if(sc == 1){
            temp.support_num = temp.support_num - 1
          }else{
            temp.comfort_num = temp.comfort_num - 1
          }
          that.setData({
            contentdetail:temp
          })
          loadFailed(result.msg)
        }else{
          loadFailed(result.msg)
        }
        
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  onShow: function() {
  },
  onPullDownRefresh: function() {
    //下拉刷新整个记录列表
    wx.showLoading({
      title: '刷新中',
      mask: true
    })
    this.setData({
      currentTime :formatTime(new Date()),
      commentList:[]
    })
    this.getCommentList();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    this.getCommentList();
  },

  activeNav: function(e) {
    this.setData({
      currentIndexNav: e.target.dataset.index
    })
  },


  updateCommentList: function(_id) {
    //删除后更新记录列表
    let commentList = this.data.commentList;
    //去掉删除的
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i]._id == _id) {
        commentList.splice(i, 1);
        break;
      }
    }
    this.data.commentList = commentList;
  },

  jump: function(event) {
    console.log(event)
    let flag = event.currentTarget.dataset.commid;
    let childid = event.currentTarget.dataset.childid;
    let parentid = event.currentTarget.dataset.parentid;
  
    if (flag == -1) { //评论帖子跳转 
      this.setData({
        jumpflag: !this.data.jumpflag,
        replyComm: null,
        mainTopicComm: {
          contentdetail: this.data.contentdetail,
          userInfo: this.data.userInfo
        }
      })
      console.log(this.data.mainTopicComm);
    } else {
      let data;
      console.log('评论评论跳转');
      if(flag!=null){
        childid = flag;
        parentid = flag;
      }
      const db = wx.cloud.database();
      db.collection('commentDoc').doc(childid).get().then(res => {
        data = res.data;
        this.setData({
          jumpflag: !this.data.jumpflag,
          replyComm: {
            userInfo: this.data.userInfo, //评论人的信息 
            byreviewInfo: data, //被评论的所有信息 
            parentId:parentid
          },
          mainTopicComm: null
        })
      })
    }

  },

  doCommit:function(event){
    console.log("开始发送")
    var content = event.detail.value.content;
    var under_post_id = this.data.contentdetail.hollowId;
    var reply_post_id = this.data.replyId;
    this.commit(content,under_post_id,reply_post_id);
  },

  doComment:function(event){
    console.log(event)
    let hollowId = event.currentTarget.dataset.recordid
    let replyName = event.currentTarget.dataset.name
    this.setData({
      replyId:hollowId,
      replyto:"回复 @ "+ replyName + ":",
      focus : true
    })
  },

  commit:function(content,under_post_id,reply_post_id){
    var time = formatTime(new Date());
    if (content == null || content == ""){
      util.showTip("话题内容不能为空");
      return;
    }
    var that = this
    var urlsend = ipv4 + "/hollow/createHollow"
    wx.request({
      url: urlsend,
      method: 'post',
      header: {
        'content-type': 'application/json' // 豆瓣一定不能是json
      },
      data:{
        time : time,
        content: content,
        under_post_id : under_post_id,
        reply_post_id : reply_post_id,
        belong_to : that.data.userId
      },
      success: function(res) {
        that.setData({
          focus:false
        })
        handleRes(res)
      },
      fail: function(error) {
        console.log(error)
        that.setData({
          canshow : false
        })
      }
    })
  },

  getFocus:function(){
    this.setData({
      replyId:this.data.contentdetail.hollowId,
      replyto:"回复 @ "+ this.data.contentdetail.username + ":",
      focus:true
    })
  },

  loseFocus:function(){
    this.setData({
      replyto:"友善的评论是交流的起点"
    })
  },

  

  //监听页面滚动事件
  onPageScroll: function() {

  }
})
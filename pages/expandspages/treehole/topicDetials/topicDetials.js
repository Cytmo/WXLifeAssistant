var util = require('../../../../utils/util.js');
var th = require('../../../../utils/throttle/throttle.js');
import { formatTime,formatDate } from '../../../../utils/common'
import {handleRes} from '../../../../utils/czutils'
const app = getApp()

var ipv4 = "http://localhost:80"

Page({
  data: {
    userId : 0,
    commentList: [],
    contentdetail: Object,
    currentTime:null,

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
    console.log(options)
    var hollowId = options.recordid
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
          contentdetail : hollow
        })
        if(ifLoad){
          that.setData({
            currentTime :formatTime(new Date())
          })
          that.getCommentList()
        }
      },
      fail: function(error) {
        console.log(error)
        loadFailed("无法加载")
        wx.navigateBack({})
      }
    })
  },

  getCommentList:function(){
    var time = this.data.currentTime
    console.log("time:" + time)
    var userId = this.data.userId
    console.log("userId:" + userId)
    var under_post_id = this.data.contentdetail.hollowId
    console.log("hollowId:" + under_post_id)
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
          that.setData({
            commentList:tempList
          })
        }
      },
      fail: function(error) {
        console.log(error)
        loadFailed("无法加载")
        wx.navigateBack({})
      }
    })


  },

  onComfortPublic:function(){},

  onAgainstPublic:function(){},
  
  onShow: function() {
  },
  fetchCommentList: function() {
    //当前页数，页面记录数大小
    let pageIndex = this.data.pageIndex;
    let pageSize = this.data.pageSize;
    const db = wx.cloud.database();
    //先计算评论总数
    db.collection('commentDoc').where({
      recordId: this.data.recordId
    }).count().then(res2 => {
      let pageCount = Math.ceil(res2.total / pageSize);
      let total = res2.total;
      //分页获取记录列表内容
      db.collection('commentDoc').where({
        recordId: this.data.recordId
      }).skip((pageIndex - 1) * pageSize).limit(pageSize).orderBy('upTime', 'asc').get().then(res3 => {
        console.log("获取记录列表成功");
        //先获取原先的记录列表
        let tempList = this.data.commentList;
        if (this.data.pageIndex == 1) {
          //如果要显示第一页，无需拼接记录列表数据
          tempList = res3.data;
        } else {
          //否则，拼接新的记录列表数据
          tempList = tempList.concat(res3.data);
        }
        //更新数据
        this.setData({
          pageCount: pageCount,
          total: total,
          commentList: tempList
        });
        wx.hideLoading();
        //加载子评论
        for(let i = 0;i < tempList.length; i++){
          db.collection('commentDoc').where({ recordId: tempList[i]._id }).limit(20).orderBy('upTime', 'asc').get().then(res3 => {
            this.data.commentList[i].subCommentList = res3.data
            this.setData({
              commentList: this.data.commentList
            });
          });
        }
      });
    });
  },

  onPullDownRefresh: function() {
    //下拉刷新整个记录列表
    wx.showLoading({
      title: '刷新中',
      mask: true
    })
    //请求数据库获取指定id的数据详情
    const db = wx.cloud.database()
    //先获取话语记录
    db.collection('utteranceDoc').doc(this.data.recordId).get().then(res1 => {
      this.setData({
        contentdetail: res1.data
      });
      //获取话语点赞状态
      this.getOnLikePublic(0, res1.data);
      //分页加载评论
      this.data.pageIndex = 1;
      this.fetchCommentList();
    });
    //停止下拉刷新
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (this.data.pageIndex < this.data.pageCount) {
      //如果没到最后一页，页码加1，并加载新的一页记录列表数据
      this.data.pageIndex = this.data.pageIndex + 1;
      this.fetchCommentList();
    } else {
      util.showTip('没有更多记录了');
    }
  },

  activeNav: function(e) {
    this.setData({
      currentIndexNav: e.target.dataset.index
    })
  },

  //点击发布函数
  publish: function(event) {
    this.setData({
      jumpflag: event.detail.jump,
    })
    //请求数据库获取指定id的数据详情
    const db = wx.cloud.database();
    //获取当前评论数
    var num = this.data.commNum;
    //记录发布的评论是一级的还是二级的
    var f = event.detail.flag;
    if(f == 1){
      num++;
    }else{
      //只用刷新子评论
      db.collection('commentDoc').where({ recordId: event.detail.parentid }).limit(20).orderBy('upTime', 'asc').get().then(res3 => {
        let tempList = this.data.commentList;
        for (let i = 0; i < tempList.length;i++){
          if (tempList[i]._id == event.detail.parentid){
            this.data.commentList[i].subCommentList = res3.data
            break;
          }
        }
        this.setData({
          jumpflag: event.detail.jump,
          commentList: this.data.commentList
        });
      });
      return;
    }
    //先获取话语记录
    db.collection('utteranceDoc').doc(this.data.recordId).get().then(res1 => {
      this.setData({
        contentdetail: res1.data,
        commNum: num
      });
      //获取话语点赞状态
      this.getOnLikePublic(0, res1.data);
      //判断是否需要分页加载最新一条评论,当前页未满5条，需加载，已满，无需加载
      this.fetchAddComment();
    });
  },
  fetchAddComment: function() {
    let that = this;
    let commentList = this.data.commentList;
    //加载一条新记录加入当前记录列表
    let pageIndex = this.data.pageIndex;
    let pageSize = this.data.pageSize;
    const db = wx.cloud.database();
    //更新总数，页数，还有记录列表
    db.collection("commentDoc").where({
      recordId: that.data.recordId
    }).count({
      success: function(res) {
        console.log("获取记录列表总数成功" + res.total);
        let pageCount = Math.ceil(res.total / pageSize);
        let total = res.total;
        if (commentList.length == 0 || commentList.length % pageSize != 0) {
          //当前页未满5条，需加载
          //分页因为是最新，所以跳过total - 1条
          db.collection("commentDoc").where({
            recordId: that.data.recordId
          }).skip(total - 1).limit(1).orderBy('upTime', 'asc').get({
            success: function(res) {
              console.log("获取记录列表成功");
              //把获得的新数据加到尾部
              commentList = commentList.concat(res.data);
              //更新数据
              that.setData({
                pageCount: pageCount,
                total: total,
                commentList: commentList
              });
            },
            fail: function(res) {
              console.log("获取记录列表失败");
            }
          });
        } else {
          //已满，无需加载
          that.setData({
            pageCount: pageCount,
            total: total,
            commentList: commentList
          });
        }
      },
      fail: function(res) {
        console.log("获取记录列表总数失败");
      }
    });
  },

  //一级评论删除
  myDelete: function(event) {
    //请求数据库获取指定id的数据详情
    const db = wx.cloud.database()
    //获取当前评论数，然后减1渲染页面
    var num = this.data.commNum;
    num--;
    //先获取话语记录
    db.collection('utteranceDoc').doc(this.data.recordId).get().then(res1 => {
      this.setData({
        contentdetail: res1.data,
        commNum: num
      });
      //获取话语点赞状态
      this.getOnLikePublic(0, res1.data);
      //删除后更新记录列表
      this.updateCommentList(event.detail._id);
      //分页加载一条新评论
      this.fetchNewComment();
    });
  },

  //二级评论删除
  deleteSecondary: function(event) {
    //遍历找到要删除的子评论
    let tempList = this.data.commentList;
    for(let i = 0;i < tempList.length; i++){
      if (tempList[i]._id == event.detail.recordId){
        for(let j = 0;j < tempList[i].subCommentList.length; j++){
          if (tempList[i].subCommentList[j]._id == event.detail._id){
            tempList[i].subCommentList.splice(j,1);
            break;
          }
        }
      }
    }
    //重新渲染评论列表
    this.setData({
      commentList:tempList
    });
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
  fetchNewComment: function() {
    let that = this;
    let commentList = this.data.commentList;
    //加载一条新记录加入当前记录列表
    let pageIndex = this.data.pageIndex;
    let pageSize = this.data.pageSize;
    const db = wx.cloud.database();
    //更新总数，页数，还有记录列表
    db.collection("commentDoc").where({
      recordId: that.data.recordId
    }).count({
      success: function(res) {
        console.log("获取记录列表总数成功" + res.total);
        let pageCount = Math.ceil(res.total / pageSize);
        let total = res.total;
        if ((commentList.length + 1) <= res.total) {
          //如果还有未加载数据，则从数据库取一条数据补充当前页
          //分页获取记录列表内容，因为是当前页补充一条新数据，所以跳过pageIndex * pageSize - 1条
          db.collection("commentDoc").where({
            recordId: that.data.recordId
          }).skip(pageIndex * pageSize - 1).limit(1).orderBy('upTime', 'asc').get({
            success: function(res) {
              console.log("获取记录列表成功");
              //把获得的新数据加到尾部
              commentList = commentList.concat(res.data);
              //更新数据
              that.setData({
                pageCount: pageCount,
                total: total,
                commentList: commentList
              });
            },
            fail: function(res) {
              console.log("获取记录列表失败");
            }
          });
        } else {
          //没有还未加载数据
          if (total % pageSize == 0) {
            //如果是当前页最后一条被删除，回退一页
            that.data.pageIndex = pageIndex - 1;
          }
          that.setData({
            pageCount: pageCount,
            total: total,
            commentList: commentList
          });
        }
      },
      fail: function(res) {
        console.log("获取记录列表总数失败");
      }
    });
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

  getOnLikePublic: function(index, newDoc) {
    let that = this;
    let openId = this.data.openId;
    let id = newDoc._id;
    const db = wx.cloud.database();
    db.collection("praiseDoc").where({
      clickUserId: openId,
      recordId: id
    }).count({
      success: function(res) {
        if (res.total != 0) {
          //添加喜欢键值对id:true
          let state = "onLikePublic." + id;
          that.setData({
            [state]: true
          });
        } else {
          console.log("用户不喜欢");
          //添加不喜欢键值对id:false
          let state = "onLikePublic." + id;
          that.setData({
            [state]: false
          });
        }
      },
      fail: function(res) {
        //获取失败,默认是不喜欢
        console.log("默认用户不喜欢");
        //添加不喜欢键值对id:true
        let state = "onLikePublic." + id;
        that.setData({
          [state]: false
        });

      }
    });
  },

  doCommit:function(event){
    var content = event.detail.value.content;
    var under_post_id = this.data.contentdetail.hollowId;
    this.commit(content,under_post_id,under_post_id);
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



  /**
   * 点赞响应事件(已添加节流函数，防止恶意点击)
   */
  onLikePublic: th.throttle(function(that, event) {
    //点赞获取点赞者的openid和记录的id和点赞数
    let localopenid = app.globalData.openId;
    let temp = that.data.contentdetail;
    let _id = temp._id;
    let state = "onLikePublic." + _id;
    let recordUserOpenId = temp._openid;
    let recordUserName = temp.publisher;
    let firstImage;
    let summary;
    let flag;
    if (temp.imageUrls != null) {
      firstImage = temp.imageUrls[0];
    } else {
      firstImage = null;
    }
    summary = that.getSummary(temp.content);
    if (!that.data.onLikePublic[_id]) {
      //点赞
      temp.praiseNum = temp.praiseNum + 1;
      flag = 1;
      wx.showToast({
        title: '点赞成功',
      });
    } else { //取消点赞
      temp.praiseNum = temp.praiseNum == 0 ? 0 : temp.praiseNum - 1;
      flag = 0;
      wx.showToast({
        title: '已取消点赞',
      });
    }
    that.setData({
      [state]: !that.data.onLikePublic[_id],
      contentdetail: temp
    });

    //修改云端数据
    that.upLoadLikeNumber(flag, _id, localopenid, recordUserOpenId, recordUserName, firstImage, summary);
  }, 2000),

  getSummary: function(content) {
    if (content.length <= 50) {
      content = content;
    } else {
      content = content.slice(0, 50) + '...';
    }
    return content;
  },

  //上传点赞数据
  upLoadLikeNumber: function(flag, id, opendId, recordUserOpenId, recordUserName, firstImage, summary) {
    let operate = null;
    operate = flag == 1 ? 'add' : 'remove';
    //事后上传数据
    //生成大致点赞时间
    let time = util.formatTime(new Date(), "Y-M-D h:m:s");
    let clickUserName = app.globalData.userInfo.nickName;
    console.log(recordUserOpenId)
    //调用点赞数的云函数
    wx.cloud.callFunction({
      // 云函数名称
      name: 'upLoadOperate',
      // 传给云函数的参数
      data: {
        _id: id,
        flag: flag,
      },
      success: function(res) {
        wx.cloud.callFunction({
          // 调用获取指定数据的云函数
          name: 'praiseOperate',
          // 传递给云函数的event参数
          data: {
            recordId: id,
            clickUserId: opendId,
            recordUserId: recordUserOpenId,
            time: time,
            clickUserName: clickUserName,
            recordUserName: recordUserName,
            firstImage: firstImage,
            summary: summary,
            first: true,
            operate: operate
          }
        }).then(res => {

        }).catch(err => {})
      },
      fail: console.error
    })
  },
  //图片预览
  previewimg: function (event) {
    avoidPreviewImageOnShow = true;
    const current = event.target.dataset.current;
    const urls = event.target.dataset.urls;
    wx.previewImage({
      current: current,
      urls: urls
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
  
  //监听页面滚动事件
  onPageScroll: function() {

  }
})
// pages/chat-list/chat-list.js
const app = getApp()
/**
 * 会话列表页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conversations: [],
    token: "",
    userId: "",
    lastChat:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that =this
    wx.getStorage({
      key:'token',
      success(res){
        console.log("成功读取本地token")
        console.log(res.data)
        var token = res.data
        that.setData({
          token:res.data
        },()=>{
          that.userId = app.globalData.userId
          that.authorization(token)
        })

    },
    fail(res){
        wx.showToast({
          title: '请先登录',
          icon:"error",
          duration:2000
        })
        wx.setStorageSync('ifShowWarn',1)
          wx.switchTab({
            
            url: '/pages/user/user',
          })
        
    }
  })
  },

  async onShow() {

    // getApp().getIMHandler().setOnReceiveMessageListener({
    //     listener: (msg) => {
    //         console.log('会话列表', msg);
    //         msg.type === 'get-conversations' && this.setData({conversations: msg.conversations.map(item => this.getConversationsItem(item))})
    //     }
    // });
    // try {
    //     await getApp().getIMHandler().sendMsg({
    //         content: {
    //             type: 'get-conversations',
    //             userId: getApp().globalData.userInfo.userId
    //         }
    //     });
    //     console.log('获取会话列表消息发送成功');
    // } catch (e) {
    //     console.log('获取会话列表失败', e);
    // }
  },

  getConversationsItem(item) {
    let {
      latestMsg,
      ...msg
    } = item;
    return Object.assign(msg, JSON.parse(latestMsg));
  },

  toChat(e) {
    let item = e.currentTarget.dataset.item;
    delete item.latestMsg;
    delete item.unread;
    delete item.content;
    wx.navigateTo({
      url: `../chat/chat?friend=${JSON.stringify(item)}`
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async authorization(e) {
    var that = this
    getApp().getIMHandler().setOnReceiveMessageListener({

      listener: (msg) => {
        console.log(msg);
        // msg.type === 'get-conversations' && this.setData({conversations: msg.conversations.map(item => this.getConversationsItem(item))})
      }
    });
    try {
      console.log("正在等待认证");
      await getApp().getIMHandler().sendMsg({
        content: {
          method: "authorization",
          data: {
            "token": e
          }
        }
      });
      getApp().getIMHandler().setOnReceiveMessageListener({

        listener: (msg) => {
          console.log(msg);
          // msg.type === 'get-conversations' && this.setData({conversations: msg.conversations.map(item => this.getConversationsItem(item))})
        }
      });
    } catch (e) {
      console.log('认证失败', e);
    }


  },

  beginMatch: function (e) {
    wx.showToast({
      title: '正在后台匹配',
      icon: "error",
      duration: 2000
    })
    var userId = this.userId
    var type = e.currentTarget.dataset.type
    console.log("开始匹配,userID为：" + userId)
    var that = this
    getApp().getIMHandler().setOnReceiveMessageListener({

      listener: (msg) => {
        console.log(msg);
        if (msg.user != "null" && msg.code == 0) {
          var temp = {
            conversationId: "-1",
            friendHeadUrl: msg.user.image,
            friendId: msg.user.userId,
            friendName: msg.user.image,
            msgUserId: msg.user.userId,
            timeStr: "19:06",
            timestamp: 1533294362000,
            type: "text",
          }
          that.goToChat(temp);
        }
        if (msg.action == "matchSuccess") {
          // wx.showModal({
          //   cancelColor: 'cancelColor',
          //   title: "提示",
          //   content: "匹配成功，对方为：" + msg.user.username + "，是否进入聊天",
          //   success() {
              // this.setData({conversations: msg.conversations.map(item => this.getConversationsItem(item))})
              wx.showToast({
                title: '进入聊天，对方为'+msg.user.userId,
                icon: "error",
                duration: 2000
              })
              wx.showToast({
                title: '请注意文明交流',
              })
              console.log("用户进入聊天")

              var temp = {
                conversationId: "-1",
                friendHeadUrl: msg.user.image,
                friendId: msg.user.userId,
                friendName: msg.user.image,
                msgUserId: msg.user.userId,
                timeStr: "19:06",
                timestamp: 1533294362000,
                type: "text",
              }
              that.goToChat(temp);

            // },
            // fail() {
            //   console.log("用户拒绝聊天")
            //   try {
            //     getApp().getIMHandler().sendMsg({
            //       content: {
                    
            //           method: "handleRequest",
            //           data: {
            //             targetUserId: msg.user.userId,
            //             accept: "false"
            //           }
                    

            //       }
            //     });
            //     console.log('发送拒绝消息成功');

            //   } catch (e) {
            //     console.log('发送拒绝消息失败', e);
            //   }
            // }

          // })
        }
      }
    });
    try {
      getApp().getIMHandler().sendMsg({
        content: {
          method: "match",
          data: {
            type: type
          }
        }
      });
      console.log('发送匹配消息成功');

    } catch (e) {
      console.log('发送匹配消息认证失败', e);
    }


  },

  endMatch: function (e) {
    var userId = this.userId
    var type = e.currentTarget.dataset.type
    console.log("结束匹配,userID为：" + userId)
    var that = this
    getApp().getIMHandler().setOnReceiveMessageListener({

      listener: (msg) => {
        console.log(msg);

      }
    });
    try {
      getApp().getIMHandler().sendMsg({
        content: {
          method: "cancelMatch",
          data: {

          }
        }
      });
      console.log('结束匹配');

    } catch (e) {
      console.log('错误，无法结束匹配', e);
    }


  },


  goToChat: function (temp) { 
    console.log(temp)
    this.setData({
      lastChat:temp}
    )
    var that = this
    // getApp().getIMHandler().setOnReceiveMessageListener({

    //   listener: (msg) => {
    //     console.log(msg);
    //     if (!(msg.action = "matchSuccess")) {
    //       wx.showModal({
    //         cancelColor: 'cancelColor',
    //         title: "提示",
    //         content: "收到对方的匹配申请，对方为：" + msg.user.username + "，是否进入聊天",
    //         success() {
    //           var temp = {
    //             conversationId: "-1",
    //             friendHeadUrl: msg.user.image,
    //             friendId: msg.user.userId,
    //             friendName: msg.user.image,
    //             msgUserId: msg.user.userId,
    //             timeStr: "19:06",
    //             timestamp: 1533294362000,
    //             type: "text",
    //           }
    //           wx.navigateTo({
    //             url: `../chat/chat?friend=${JSON.stringify(temp)}`
    //           })
    //         }
    //       })
    //     }
    //   }
    // });
    //{method:"chat" , data:{ message:"4sssssssss",userId:"1" }}

    try {
      getApp().getIMHandler().sendMsg({
        content: {
          method: "requestChat",
          data: {
            userId: temp.msgUserId
          }
        }
      });
      console.log('申请成功');

    } catch (e) {
      console.log('申请失败', e);
    }

    wx.navigateTo({
      url: `../chat/chat?friend=${JSON.stringify(temp)}`
    })
  },



  toChat(e) {
    let item = e.currentTarget.dataset.item;
    delete item.latestMsg;
    delete item.unread;
    delete item.content;
    wx.navigateTo({
      url: `../chat/chat?friend=${JSON.stringify(item)}`
    });
  },
  // getConversationsItem(item) {
  //     let {latestMsg, ...msg} = item;
  //     return Object.assign(msg, JSON.parse(latestMsg));
  // }


  gotoLastChat: function () {
    var lastChat = this.lastChat
    var temp = lastChat;
    if(lastChat==null){wx.showToast({
      icon:"error",
      title: '无上次会话信息',
    })}else{
      try {
        getApp().getIMHandler().sendMsg({
          content: {
            method: "requestChat",
            data: {
              userId: temp.msgUserId
            }
          }
        });
        console.log('申请成功');
  
      } catch (e) {
        console.log('申请失败', e);
      }
  
      wx.navigateTo({
        url: `../chat/chat?friend=${JSON.stringify(temp)}`
      })
  }
  }
});
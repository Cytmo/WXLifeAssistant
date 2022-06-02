// pages/chat-list/chat-list.js
const app=getApp()
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
    userId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.token = options.token,
      this.userId = options.userid,
      this.authorization(options.token)

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
    let {latestMsg, ...msg} = item;
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
    var userId = this.userId
    var type = e.currentTarget.dataset.type
    console.log("开始匹配,userID为：" + userId)
    var that = this
    getApp().getIMHandler().setOnReceiveMessageListener({

      listener: (msg) => {
        console.log(msg);
        if (msg.action == "matchSuccess") {
          wx.showModal({
            cancelColor: 'cancelColor',
            title: "提示",
            content: "匹配成功，对方为：" + msg.user.username + "，是否进入聊天",
            success() {
              // this.setData({conversations: msg.conversations.map(item => this.getConversationsItem(item))})
              console.log("用户进入聊天")
             
              var temp = {
                conversationId: "-1",
                friendHeadUrl: msg.user.image,
                friendId: msg.user.userId,
                friendName: msg.user.image,
                msgUserId: msg.user.userId,
                timeStr: "19:06",
                timestamp:1533294362000,
                type: "text",
              }
              that.goToChat(temp);
          
            }

          })
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
      console.log('认证成功');

    } catch (e) {
      console.log('认证失败', e);
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
      console.log('认证成功');

    } catch (e) {
      console.log('认证失败', e);
    }


  },


  goToChat:function(temp){
    
    var that = this
    getApp().getIMHandler().setOnReceiveMessageListener({

      listener: (msg) => {
        console.log(msg);
        if(!(msg.action="matchSuccess")){
          console.log(msg)
          wx.showModal({
            cancelColor: 'cancelColor',
            title: "提示",
            content: "收到聊天申请，对方为：" + msg.user.username + "，是否进入聊天",
            success() {
              var temp = {
                conversationId: "-1",
                friendHeadUrl: msg.user.image,
                friendId: msg.user.userId,
                friendName: msg.user.image,
                msgUserId: msg.user.userId,
                timeStr: "19:06",
                timestamp:1533294362000,
                type: "text",
              }
              wx.navigateTo({
                url: `../chat/chat?friend=${JSON.stringify(temp)}`
              })
            }}
           )
        }
      }
    });
    try {
      getApp().getIMHandler().sendMsg({
        content: {
          method: "requestChat",
          data: {
            userId:temp.msgUserId
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


  test:function(){
    var temp = {
      conversationId: "-1",
      friendHeadUrl: 1,
      friendId: 3,
      friendName: 3,
      msgUserId: 3,
      timeStr: "19:06",
      timestamp:1533294362000,
      type: "text",
    }
    app.globalData.userId="3"
    wx.navigateTo({
      url: `../chat/chat?friend=${JSON.stringify(temp)}`
    })
  }
});
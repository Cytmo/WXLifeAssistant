import {
  dealChatTime
} from "../../../utils/time";
const app = getApp()
export default class IMOperator {
  static VoiceType = 'voice';
  static TextType = 'text';
  static ImageType = 'image';
  static CustomType = 'custom';

  constructor(page, opts) {
    this._opts = opts;
    this._latestTImestamp = 0; //最新消息的时间戳
    this._myHeadUrl = getApp().globalData.userInfo.avatarUrl;
    this._otherHeadUrl = this._opts.friendHeadUrl;
    this._page = page;
  }

  getFriendId() {
    return this._opts.friendId;
  }

  onSimulateReceiveMsg(cbOk) {
    // getApp().getIMHandler().sendMsg({
    //     content: {
    //         type: 'get-history',
    //         userId: getApp().globalData.userInfo.userId,
    //         friendId: this.getFriendId()
    //     }
    // });
    getApp().getIMHandler().setOnReceiveMessageListener({
      listener: (msg) => {
        console.log("收到的消息为")
        console.log(msg)
        if(msg.action=="userGoOffline"){
          this._page.UI.updateChatStatus('对方已离线...');
        }
        if(msg.msg=="参数错误 : 没有建立聊天"){
          this._page.UI.updateChatStatus('发送失败，对方已离线...');
        }
       // if(msg.)
        if (msg.chatMessage == null ||msg.action==null) {
          return;
        }
 
        if (!msg) {
          return;
        }
        msg.isMy = msg.msgUserId === getApp().globalData.userInfo.userId;
        console.log("收到聊天信息，进入构建函数，收到的消息为")
        console.log(msg)
        const item = this.createMyChatItem(msg);
        // const item = this.createNormalChatItem({type: 'voice', content: '上传文件返回的语音文件路径', isMy: false});
        // const item = this.createNormalChatItem({type: 'image', content: '上传文件返回的图片文件路径', isMy: false});
        this._latestTImestamp = item.timestamp;
        //这里是收到好友消息的回调函数，建议传入的item是 由 createNormalChatItem 方法生成的。
        cbOk && cbOk(item);
      }
    });

  }

  async onSimulateSendMsg({
    content
  }) {
    //这里content即为要发送的数据
    //这里的content是一个对象了，不再是一个JSON格式的字符串。这样可以在发送消息的底层统一处理。
    try {
      content = {
        method: "chat",
        data: {
          message: content.content,
          userId: content.friendId
        },
        content
      }
      const {
        content: contentSendSuccess
      } = await getApp().getIMHandler().sendMsg({
        content
      });
      //这个contentSendSuccess格式一样,也是一个对象
      const msg = this.createNormalChatItem(contentSendSuccess);
      // this._latestTImestamp = msg.timestamp;
      this._latestTImestamp = Date.now();
      return Promise.resolve({
        msg
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  createChatItemContent({
    type = IMOperator.TextType,
    content = '',
    duration
  } = {}) {
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    return {
      content,
      type,
      conversationId: 0, //会话id，目前未用到
      userId: getApp().globalData.userInfo.userId,
      friendId: this.getFriendId(), //好友id
      duration
    };
  }

  createNormalChatItem({
    type = IMOperator.TextType,
    content = '',
    isMy = true,
    duration
  } = {}) {
    console.log(content)
    if (content.msg == "消息推送") {
      console.log("开始构建收到的信息")
      const currentTimestamp = Date.now();
      const time = dealChatTime(currentTimestamp, this._latestTImestamp);
      let obj = {
        method: "chat",
        msgId: 0, //消息id
        friendId: content.user.userId, //好友id
        isMy:false, //我发送的消息？
        showTime: time.ifShowTime, //是否显示该次发送时间
        time: time.timeStr, //发送时间 如 09:15,
        timestamp: currentTimestamp,
        type:"text", //内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
        content:content.chatMessage, // 显示的内容，根据不同的类型，在这里填充不同的信息。
        headUrl: isMy ? this._myHeadUrl : this._otherHeadUrl, //显示的头像，自己或好友的。
        sendStatus: 'success', //发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
        voiceDuration: duration, //语音时长 单位秒
        isPlaying: false, //语音是否正在播放
        data: {
          message: content,
          userId: this.getFriendId()
        }
      };
      if (type !== IMOperator.TextType) {
        obj.saveKey = content; //saveKey是存储文件时的key
      }
      return obj;
    } else {
      if (!content) return;
      const currentTimestamp = Date.now();
      const time = dealChatTime(currentTimestamp, this._latestTImestamp);
      let obj = {
        method: "chat",

        msgId: 0, //消息id
        friendId: this.getFriendId(), //好友id
        isMy, //我发送的消息？
        showTime: time.ifShowTime, //是否显示该次发送时间
        time: time.timeStr, //发送时间 如 09:15,
        timestamp: currentTimestamp,
        type, //内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
        content, // 显示的内容，根据不同的类型，在这里填充不同的信息。
        headUrl: isMy ? this._myHeadUrl : this._otherHeadUrl, //显示的头像，自己或好友的。
        sendStatus: 'success', //发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
        voiceDuration: duration, //语音时长 单位秒
        isPlaying: false, //语音是否正在播放
        data: {
          message: content,
          userId: this.getFriendId()
        }
      };
      if (type !== IMOperator.TextType) {
        obj.saveKey = content; //saveKey是存储文件时的key
      }
      return obj;
    }
  }

  static createCustomChatItem() {
    return {
      timestamp: Date.now(),
      type: IMOperator.CustomType,
      content: '会话已关闭'
    }
  }


  createMyChatItem(content) {
    console.log(content)
    if (content.msg == "消息推送") {
      console.log("开始构建收到的信息")
      const currentTimestamp = Date.now();
      const time = dealChatTime(currentTimestamp, this._latestTImestamp);
      let obj = {
        msgId: 0, //消息id
        friendId: content.user.userId, //好友id
        isMy:false, //我发送的消息？
        showTime: time.ifShowTime, //是否显示该次发送时间
        time: time.timeStr, //发送时间 如 09:15,
        timestamp: currentTimestamp,
        type:"text", //内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
        content:content.chatMessage, // 显示的内容，根据不同的类型，在这里填充不同的信息。
        headUrl: content.user.image, //显示的头像，自己或好友的。
        sendStatus: 'success', //发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
        voiceDuration: "", //语音时长 单位秒
        isPlaying: false, //语音是否正在播放
        data: {
          message: content,
          userId: this.getFriendId()
        }
      };
      return obj;
    }
  }
}
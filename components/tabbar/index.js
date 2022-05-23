Component({
  // 组件的属性列表
  properties: {
    // 接受父组件的给的数据
    active: {
        type: "String",
        value: ""
    }
  },
  data: { 
    selected: undefined,
      "color": "#9CA2BB",
      "selectedColor": "#3B49E0",
      "borderStyle": "black",
      "list": [
        {
          "selectedIconPath": "/images/home_select.png",
          "iconPath": "/images/home.png",
          "pagePath": "/pages/expandspages/treehole/index/index",
          "text": "树洞"
        },
        {
          "selectedIconPath": "/images/publish_topics.png",
          "iconPath": "/images/publish_topics.png",
          "pagePath": "/pages/expandspages/treehole/publishTopics/publishTopics",
          "text": "发布话题"
        },
        {
          "selectedIconPath": "/images/message_select.png",
          "iconPath": "/images/message.png",
          "pagePath": "/pages/expandspages/treehole/message/message",
          "text": "消息"
        }

  ]
  },
  attached() {
    
  },
  methods: {
    switchTab(e) {
      if (this.data.selected === e.currentTarget.dataset.index) {
        return false;
      } else {
        const url=e.currentTarget.dataset.path
        //wx.switchTab({url})
        wx.navigateTo({url})
      }
    },
    run() {
      console.log(this.data.active);      
      this.setData({
          // 通过this.data获取父组件里传过来的值
          selected: this.data.active
      });
      console.log(this.data.selected);
    }
  }
})
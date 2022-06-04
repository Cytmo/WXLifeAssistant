// components/against/against.js
import {loadSuccess,loadFailed,handleRes} from '../../utils/czutils'
var ipv4 = "http://localhost:80"
const app = getApp()
// var ipv4 = "http://localhost:8081"
// var ipv4 = app.globalData.url
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userId : 0,
    againstId : 0,
    againstTo : 0
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTag :false,
    focus : false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeShow:function(){
      this.setData({
        showTag : false,
        focus : false
      })
    },
    sendAgainst:function(event){
      var content = event.detail.value.content;
      var userId = this.data.userId;
      var againstId = this.data.againstId;
      var urlin = ipv4 + "/hollow/against"
      that = this
      wx.request({
        url: urlin,
        method: 'post',
        header: {
          'content-type': 'application/json' // 豆瓣一定不能是json
        },
        data:{
          hollowId:againstId,
          userId:userId,
          reportText:content
        },
        success: function(res) {
          handleRes(res)
          that.closeShow()
        },
        fail: function(error) {
          console.log(error)
          loadFailed("出错啦，详细见log")
          that.closeShow()
        }
      })
      
    },
    setId:function(userId,againstId){
      this.setData({
        userId:userId,
        againstId:againstId
      })
    },
    toShow:function(){
      this.setData({
        showTag : true,
        focus : true
      })
    },
    toFocus:function(){
      this.setData({
        focus : true
      })
    }

  }
})

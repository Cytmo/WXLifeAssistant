// 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
 
    onLoad: function () {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'N56BZ-5566W-7KARR-RHYGX-5T6KQ-RRFBQ'
        });
    },
    onShow: function () {
        // 调用接口
        qqmapsdk.search({
            keyword: '酒店',
            success: function (res) {
                console.log(res);
            },
            fail: function (res) {
                console.log(res);
            },
        complete: function (res) {
            console.log(res);
        }
     });
  }
})

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id : '',
    kind: '',
    title:'热门电视推荐',
    tv: {},
    navTitle: '',
    showDescFull: true, // 简介展开,true显示简介所有内容
    desc60words: '',
    flag:false,
    show:'',
    detailInfo:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var id=params.id
    var kind=params.kind
    console.log(id)
    console.log(kind)
    var tv
  if(kind=="old"){
    tv=app.globalData.tvsHighRanks[id]
  }else{
    tv=app.globalData.tvHot[id]
  }
    this.setData({tv:tv})
    var tmp=this.getDesc60Words(tv.description)
    var tmp1=tv.description
    var detailInfo=this.splitTVInfo(tv.info)
    console.log(detailInfo)
    this.setData({tv:tv,detailInfo:detailInfo})
    var number=parseInt(tv.description.length)
     if(number>60){
       this.setData({showDescFull: false,show:tmp})
     }else{
     }
  },


  splitTVInfo:function(data){
    var tmp1=data.split("\n");
    console.log(tmp1)
    var tmp2=tmp1[11].split(":")[1].split("/")
    console.log(tmp2)
    var pattern1 = new RegExp("[A-Za-z]+");
    var otherName
    for(var x =0;x<tmp2.length;x++){
      if(this.isLetters(tmp2[x])){
        otherName=tmp2[x];
        break;
      }
    }
    if(otherName==null){
      otherName=tmp2[0]
    }
    console.log(otherName)
    var result={
       director     : tmp1[0].split(":")[1],
       screenWriter : tmp1[1].split(":")[1],
       actors       : tmp1[2].split(":")[1],
       TVType    : tmp1[3].split(":")[1],
       TVCountry : tmp1[5].split(":")[1],
       TVLanguage: tmp1[6].split(":")[1],
       firstTime    : tmp1[7].split(":")[1],
       season      : tmp1[8],
       oneSeason      : tmp1[9],
       episodeTime    : tmp1[10],
       otherName    : otherName
    }
    return result;
  },
  isLetters:function ( str ){
    var re=/^[A-Za-z]+$/;
    if (str.match(re) == null)
        return false;
    else
        return true;
},
  getDesc60Words(desc) {
    return desc.substr(0, 60)+'...';
  },
  showDescFullWords() {
    this.setData({ showDescFull: true , flag: true });
  },
  unshowDescFullWords() {
    this.setData({ showDescFull: false });
    this.setData({ flag: false });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navTitle,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
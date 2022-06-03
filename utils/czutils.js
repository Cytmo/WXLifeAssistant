function loadSuccess(){
  wx.showToast({
    title: '操作成功',
    mask : true,
    icon: 'none',
    duration: 1000//持续的时间
  })
}

function loadFailed(msg){
  wx.showToast({
    title: msg,
    mask : true,
    icon: 'none',
    duration: 2000//持续的时间
  })
}

function handleResBack(res){
  if(res.data.code == 0){
    loadSuccess()
    wx.navigateBack({})
  }else{
    loadFailed(res.data.msg)
  }
}

function handleRes(res){
  if(res.data.code == 0){
    loadSuccess()
  }else{
    loadFailed(res.data.msg)
  }
}

module.exports = {
  loadSuccess,
  loadFailed,
  handleResBack,
  handleRes

};
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    elements: [
      {
        title: '树洞',
        name: 'Tree Hole',
        color: 'pink',
        icon: 'friendfamous',
        url: '../expandspages/treehole/index/index'
      },
      {
        title: '诉说之窗',
        name: 'talk',
        color: 'mauve',
        icon: 'message',
        url: '../expandspages/chat-list/chat-list'
      },
      {
        title: '群组 ',
        name: 'Group',
        color: 'brown',
        icon: 'friend',
        url:  '/pages/recommendspages/group/group?&pageid=' + 0
      },
      {
        title: '电影推荐',
        name: 'Movies',
        color: 'cyan',
        icon: 'record',
        url: '/pages/recommendspages/movie-all/moviemain/movie'
      },
      {
        title: '小说推荐',
        name: 'Novels',
        color: 'blue',
        icon: 'form',
        url: '/pages/recommendspages/novel-all/novelmain/novel'
      },
      {
        title: '电视推荐',
        name: 'TV',
        color: 'purple',
        icon: 'video',
        url: '/pages/recommendspages/TVSeries-all/tvmain/tv'
      },



    ],
  }
})

//备选样式(颜色) 按钮背景在 WXLifeAssistant\app.wxss   line-29

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
        icon: 'btn',
        url: '../expandspages/treehole/index/index'
      },
      {
        title: '诉说之窗',
        name: 'talk',
        color: 'brown',
        icon: 'tagfill',
        url: '../expandspages/chat-list/chat-list'
      },
      {
        title: '群组 ',
        name: 'Group',
        color: 'mauve',
        icon: 'icon',
        url:  '/pages/recommendspages/group/group?&pageid=' + 0
      },
      {
        title: '电影推荐',
        name: 'Movies',
        color: 'cyan',
        icon: 'newsfill',
        url: '/pages/recommendspages/movie-all/moviemain/movie'
      },
      {
        title: '小说推荐',
        name: 'background',
        color: 'blue',
        icon: 'colorlens',
        url: '/pages/recommendspages/novel-all/novelmain/novel'
      },
      {
        title: '电视推荐',
        name: 'TV',
        color: 'purple',
        icon: 'font',
        url: '/pages/recommendspages/TVSeries-all/tvmain/tv'
      },



    ],
  }
})

//备选样式(颜色) 按钮背景在 WXLifeAssistant\app.wxss   line-29
// {
//   title: '头像',
//   name: 'avatar',
//   color: 'red',
//   icon: 'myfill',
//   url:''
// },
// {
//   title: '进度条',
//   name: 'progress',
//   color: 'orange',
//   icon: 'icloading',
//   url:''
// },
// {
//   title: '边框阴影',
//   name: 'shadow',
//   color: 'olive',
//   icon: 'copy',
//   url:''
// },
// {
//   title: '加载',
//   name: 'loading',
//   color: 'green',
//   icon: 'loading2',
//   url:''
// },
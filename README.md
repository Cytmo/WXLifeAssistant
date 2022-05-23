# WXLifeAssistant

## how to test chat 
run `npm install` & `npm run server` at the root folder and then u can try chat 
## 页面
说明
```
── recommends
── expands
── epidemic
── user
── recommendspages
   ├── TVSeries
   ├── group
   ├── movies
   ├── novel
   └── readme.md
── expandspages
   └── readme.md
── epidemicpages
   └── readme.md
── userpages
    └── readme.md
── logs
── test
   └── list
```

## 运行说明

### 1-聊天界面说明

(1)更改ip

```
delegate/app-im-delegate.js/
----line 12
    onShow(options) {
        this.iIMHandler.createConnection({options: {url: 'ws://10.131.140.87:8001'}});
    }
----
其中10.131.140.87改为自己的ip

linux&mac
ifconfig | grep "inet

```

(2)运行npm

```
cd 根目录
npm  install
npm run server
----
会显示

> wechat-im@1.0.0 server
> node server.js

WebSocket服务端建立完毕，您可以使用小程序进行通信了
```


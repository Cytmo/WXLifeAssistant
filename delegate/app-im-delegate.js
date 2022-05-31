import {getIMHandlerFactory} from "../libs/im-sdk/im-factory";

export default class AppIMDelegate {
    constructor(app) {
        this._app = app;
    }

    onLaunch(options) {
        this.iIMHandler = getIMHandlerFactory;
    }

    onShow(options) {
        this.iIMHandler.createConnection({options: {url: 'ws://10.131.150.190:8081/chat'}});
    }

    onHide() {

    }

    getIMHandlerDelegate() {
        return this.iIMHandler;
    }
}

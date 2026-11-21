import * as uiUtils from './modules/uiUtils.js';
import * as appWS from './modules/appwebsocket.js';
import {setupAppWebSocket} from "./modules/appwebsocket.js";


const userId = Math.round(Math.random()* 1000000)

uiUtils.initializeUI(userId)


const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsClient = new WebSocket(
    `${wsProtocol}//${window.location.host}/?userId=${encodeURIComponent(userId)}`
);

appWS.setupAppWebSocket(wsClient)
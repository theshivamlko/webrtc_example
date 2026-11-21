import * as uiUtils from './modules/uiUtils.js';
import * as appWS from './modules/clientWebsocket.js';
import {setupAppWebSocket} from "./modules/clientWebsocket.js";
import {logToConsole} from "./modules/uiUtils.js";
import * as ajaxUtils from "./modules/ajaxUtils.js";
import * as state from "./modules/states.js";


const userId = Math.round(Math.random()* 1000000)

uiUtils.initializeUI(userId)


const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsClient = new WebSocket(
    `${wsProtocol}//${window.location.host}/?userId=${encodeURIComponent(userId)}`
);

appWS.setupAppWebSocket(wsClient)


uiUtils.DOM.createRoomButton.onclick = (e) => {
    const roomName = uiUtils.DOM.inputRoomChannelName.value;

    if(!roomName) {
        alert("Please enter a room name");
        return;
    }

    logToConsole(`Checking if ${roomName} is available...`)

    ajaxUtils.createRoom(roomName,userId)


}

uiUtils.DOM.destroyButton.onclick = (e) => {
    const roomName = state.getState().roomName

    if(!roomName) {
        alert("Room not found");
        return;
    }

    logToConsole(`Deleting ${roomName} ...`)

    ajaxUtils.destroyRoom(roomName)


}
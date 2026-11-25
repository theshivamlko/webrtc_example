import * as uiUtils from './modules/uiUtils.js';
import * as appWS from './modules/clientWebsocket.js';
import {logToConsole} from "./modules/uiUtils.js";
import * as ajaxUtils from "./modules/ajaxUtils.js";
import * as state from "./modules/states.js";
import * as webRTCHandler from "./modules/app_webrtc.js";


const userId = Math.round(Math.random() * 1000000)

uiUtils.initializeUI(userId)


const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsClient = new WebSocket(
    `${wsProtocol}//${window.location.host}/?userId=${encodeURIComponent(userId)}`
);

appWS.setupAppWebSocket(wsClient)


uiUtils.DOM.createRoomButton.onclick = (e) => {
    const roomName = uiUtils.DOM.inputRoomNameElement.value;

    if (!roomName) {
        alert("Please enter a room name");
        return;
    }

    logToConsole(`Checking if ${roomName} is available...`)

    ajaxUtils.createRoom(roomName, userId)


}

uiUtils.DOM.destroyRoomButton.onclick = async (e) => {
    const roomName = state.getState().roomName

    if (!roomName) {
        alert("Room not found");
        return;
    }

    logToConsole(`Deleting ${roomName} ...`)

    await ajaxUtils.destroyRoom(roomName)
    wsClient.close();


}


uiUtils.DOM.joinRoomButton.onclick = async (e) => {
    const roomName = uiUtils.DOM.inputRoomNameElement.value;


    if (!roomName) {
        alert("Room not found to Join");
        return;
    }

    appWS.joinRoom(roomName, userId,wsClient)

}


uiUtils.DOM.exitButton.onclick = async (e) => {

    const roomName = state.getState().roomName;

    uiUtils.exitRoom()

    appWS.exitRoom(roomName, userId);

    logToConsole(`You have left room ${roomName} ...`)

}

uiUtils.DOM.sendMessageButton.addEventListener("click", () => {
    const message = uiUtils.DOM.messageInputField.value.trim();
    if(message) {
        // step 1: add the message to the user's UI
        uiUtils.addOutgoingMessageToUi(message);
        // step 2: sending the message to the other peer
        webRTCHandler.sendMessageUsingDataChannel(message);
    };
});

uiUtils.DOM.startVideoCallButton.addEventListener("click", async () => {
    await webRTCHandler.startVideoCall();
});

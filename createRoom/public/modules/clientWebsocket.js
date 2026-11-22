import {logToConsole} from "./uiUtils.js";
import * as appconstants from "./appconstants.js";
import * as state from "./states.js";
import * as uiUtils from "./uiUtils.js";


function onHandleMessage(incomingData) {

    const msg = JSON.parse(incomingData.data);

    switch (msg.label) {
        case appconstants.labels.NORMAL_SERVER_PROCESS:
            normalServerProcessing(msg.data)
            break;
        default:
            console.log(`Unknown server processing label`);


    }

}

export function setupAppWebSocket(wsClient) {

    state.setWSocket(wsClient)

    state.getState().ws.addEventListener("open", () => {
        logToConsole("Connected to the server 🚀");
    });

    state.getState().ws.addEventListener("message", (message) => {
        logToConsole(`Message received: ${message.data}`, appconstants.theme.green);
        onHandleMessage(message);

    });

    state.getState().ws.addEventListener("close", (event) => {
        logToConsole(`Disconnected from the server ⛔ (${event.code})`, appconstants.theme.orange);
    });

    state.getState().ws.addEventListener("error", (event) => {
        console.error("WebSocket connection error:", event);
        logToConsole("WebSocket connection failed ❌", appconstants.theme.red);
    });
}

// Outgoing
export function joinRoom(roomName, userId,wsClient) {

    const message = {

        label: appconstants.labels.NORMAL_SERVER_PROCESS,
        data: {
            type: appconstants.type.ROOM_JOIN.REQUEST,
            roomName,
            userId
        }

    }
    state.getState().ws.send(JSON.stringify(message));
}

export function exitRoom(roomName, userId) {

    const message = {

        label: appconstants.labels.NORMAL_SERVER_PROCESS,
        data: {
            type: appconstants.type.ROOM_EXIT.EXIT,
            roomName,
            userId
        }

    }
    state.getState().ws.send(JSON.stringify(message));
}


function joinSuccessHandler(data) {
    state.setOtherUserId(data.creatorId);
    state.setRoomName(data.roomName);

    uiUtils.joineeToProceedToRoom();
}

function joinNotificationHandler(data) {
    alert(`User ${data.joinUserId} has joined the room`)
    logToConsole(data.message, appconstants.theme.green);
    uiUtils.updateCreatorRoom()
}

function exitNotificationHandler(data) {
    logToConsole(data.message, appconstants.theme.red);
    uiUtils.updateUiForRemainingUser()
}

function normalServerProcessing(data) {

    switch (data.type) {
        case appconstants.type.ROOM_JOIN.RESPONSE_SUCCESS:
            joinSuccessHandler(data);
            break;
        case appconstants.type.ROOM_JOIN.RESPONSE_FAILURE:
            console.error(data.message);
            logToConsole(data.message, appconstants.theme.red);
            break;

        case appconstants.type.ROOM_JOIN.NOTIFY:
            joinNotificationHandler(data);
            break;
        case appconstants.type.ROOM_EXIT.EXIT:
            exitNotificationHandler(data);
            break;
        default:
            console.error("Unknown data type:", data.type);

    }
}


import {logToConsole} from "./uiUtils.js";
import * as appconstants from "./appconstants.js";
import * as state from "./states.js";
import * as uiUtils from "./uiUtils.js";
import * as app_webrtc from "./app_webrtc.js";
import * as webRTCHandler from "./app_webrtc.js";


function onHandleMessage(incomingData) {

    const msg = JSON.parse(incomingData.data);

    switch (msg.label) {
        case appconstants.labels.NORMAL_SERVER_PROCESS:
            console.log(`Normal server message`);
            normalServerProcessing(msg.data)
            break;
        case appconstants.labels.WEBRTC_PROCESS:
            console.log(`Processing signaling server message`);
            webRTCServerProcessing(msg.data);
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
    app_webrtc.startWebRTCProcess()

}

function joinNotificationHandler(data) {
    alert(`User ${data.joinUserId} has joined the room`)
    // The join notification identifies the newly joined peer as joinUserId.
    // creatorId is only included in the join-success response sent to the joiner.
    state.setOtherUserId(data.joinUserId)
    logToConsole(data.message, appconstants.theme.green);
    uiUtils.updateCreatorRoom()
}

function exitNotificationHandler(data) {
    logToConsole(data.message, appconstants.theme.red);
    uiUtils.updateUiForRemainingUser()
    webRTCHandler.closePeerConnection();

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
        case appconstants.type.ROOM_EXIT.NOTIFY:
            exitNotificationHandler(data);
            break;
        case appconstants.type.ROOM_DESTROY.NOTIFY:
            exitNotificationHandler(data);
            break;
        default:
            console.error("Unknown data type:", data.type);

    }
}

export function sendOffer(offer, isVideoOffer = false) {
    const message = {
        label: appconstants.labels.WEBRTC_PROCESS,
        data: {
            type: appconstants.type.WEBRTC_OFFER,
            offer,
            isVideoOffer,
            otherUserId: state.getState().otherUserId
        }
    };
    state.getState().ws.send(JSON.stringify(message));
};

function webRTCServerProcessing(data) {
    // Process the message based on the type of response
    switch(data.type) {
        // offer received
        // steps 11 and 12 (reference the md file)
        case appconstants.type.WEBRTC_OFFER:
            webRTCHandler.handleOffer(data);
            break;
        // answer received
        // steps 24 (reference the md file)
        case appconstants.type.WEBRTC_ANSWER:
            webRTCHandler.handleAnswer(data);
            break;
        // ice candidates received
        // steps 24 (reference the md file)
        case appconstants.type.WEBRTC_ICE_CANDIDATES:
            webRTCHandler.handleIceCandidates(data);
            break;
        default:
            console.log("Unknown data type: ", data.type);
    }
};

export function sendAnswer(answer, isVideoAnswer = false) {
    console.log("sendAnswer: ", answer);
    const message = {
        label: appconstants.labels.WEBRTC_PROCESS,
        data: {
            type: appconstants.type.WEBRTC_ANSWER,
            answer,
            isVideoAnswer,
            otherUserId: state.getState().otherUserId
        }
    };
    state.getState().ws.send(JSON.stringify(message));
};

export function sendIceCandidates(arrayOfIceCandidates) {
    const message = {
        label: appconstants.labels.WEBRTC_PROCESS,
        data: {
            type: appconstants.type.WEBRTC_ICE_CANDIDATES,
            candidatesArray: arrayOfIceCandidates,
            otherUserId: state.getState().otherUserId
        }
    };
    state.getState().ws.send(JSON.stringify(message));
};

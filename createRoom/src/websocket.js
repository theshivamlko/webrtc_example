import {WebSocketServer} from "ws";
import * as constants from "./constants.js";


function getUserId(request) {
    const userId = new URL(request.url, "http://localhost").searchParams.get("userId");
    return userId === null ? null : Number(userId);
}

function handleConnection(ws, request) {
    const userId = getUserId(request);
    if (userId === null || !Number.isSafeInteger(userId)) {
        ws.close(1008, "A valid userId is required");
        return;
    }

    constants.connections.push({ws: ws, userId: userId});
    console.log(`Server WebSocket connected: ${userId}`);

    ws.on("message", (message) => {
        console.log(`Server Message from ${userId}: ${message.toString()}`);
        onHandleMessage(message)
    });

    ws.on("close", () => {
        const index = constants.connections.findIndex((connection) => connection.ws === ws);

        if (index === -1) {
            console.log(`User: ${userId} not found in connections`);
            return;
        }
        constants.connections.splice(index, 1);

        console.log(`User: ${userId} removed from connections`);
        console.log(`Total connected users: ${constants.connections.length}`);
        console.log(`Server WebSocket disconnected: ${userId}`);

        constants.rooms.forEach((room) => {

            const otherUserId = (room.peer1 === userId) ? room.peer2 : room.peer1;

            const notificationMessage = {
                label: constants.type.ROOM_EXIT.NOTIFY,
                message: `User ${userId} is disconnected`,
            }

            if (otherUserId) {
                sendSocketMessageToUser(otherUserId, notificationMessage)
            }

            if (room.peer1 === userId) {
                room.peer1 = null
            } else if (room.peer2 === userId) {
                room.peer2 = null
            }
            if (room.peer1 === null || room.peer2 === null) {
                const roomIndex = constants.rooms.findIndex((r) => r.roomName === room.roomName);
                if (roomIndex !== -1) {
                    constants.rooms.splice(roomIndex, 1);
                    console.log(`Server WebSocket Room ${room.roomName} removed`);
                }
            }
        })

    });

    ws.on("error", (error) => {
        console.error(`Server WebSocket error for ${userId}:`, error);
    });
}

export function setupWebSocket(server) {
    console.log(`Server WebSocket`);

    const webSocketServer = new WebSocketServer({server});
    webSocketServer.on("connection", handleConnection);

    return webSocketServer;
}


function joinRoomHandler(data) {
    console.log(`joinRoomHandler`);
    const {roomName, userId} = data

    const existingRoom = constants.rooms.find((room) => room.roomName === roomName);

    let otherUserId = null
    console.log(`joinRoomHandler`, existingRoom);

    if (!existingRoom) {
        console.log(`joinRoomHandler11`);
        console.log(`Join failed! Room ${roomName} not found`);

        const failureMessage = {
            label: constants.labels.NORMAL_SERVER_PROCESS,
            data: {
                type: constants.type.ROOM_JOIN.RESPONSE_FAILURE,
                message: `Join failed! Room ${roomName} not found`
            }
        }

        sendSocketMessageToUser(userId, failureMessage)
        return;
    }


    if (existingRoom.peer1 && existingRoom.peer2) {
        console.log(`User try to join but Room is FULL`);

        const failureMessage = {
            label: constants.labels.NORMAL_SERVER_PROCESS,
            data: {
                type: constants.type.ROOM_JOIN.RESPONSE_FAILURE,
                message: `Room already full`
            }
        }

        sendSocketMessageToUser(userId, failureMessage)
        return;

    }

    console.log("A user is attempting to join a room");
    if (!existingRoom.peer1) {
        existingRoom.peer1 = userId;
        otherUserId = existingRoom.peer2;
        console.log(`Add user ${userId} as peer1`);
    } else {
        existingRoom.peer2 = userId;
        otherUserId = existingRoom.peer1;
        console.log(`Add user ${userId} as peer2`);
    }

    const successMessage = {
        label: constants.labels.NORMAL_SERVER_PROCESS,
        data: {
            type: constants.type.ROOM_JOIN.RESPONSE_SUCCESS,
            message: `You have successfully joined room`,
            creatorId: otherUserId,
            roomName: existingRoom.roomName
        }
    }

    sendSocketMessageToUser(userId, successMessage);

    const notificationMessage = {
        label: constants.labels.NORMAL_SERVER_PROCESS,
        data: {
            type: constants.type.ROOM_JOIN.NOTIFY,
            message: `User ${userId} has joined`,
            joinUserId: userId
        }
    }

    sendSocketMessageToUser(otherUserId, notificationMessage);

}

function exitRoomHandler(data) {
    const {roomName, userId} = data

    const existingRoom = constants.rooms.find((room) => room.roomName === roomName);

    let otherUserId = (existingRoom.peer1 === userId) ? existingRoom.peer2 : existingRoom.peer1;

    if (!existingRoom) {
        console.log(`Room exit ${roomName} not found`);
        return;

    }
    if (existingRoom.peer1 === userId) {
        existingRoom.peer1 = null
        console.log(`Remove peer1 from rooms object`, existingRoom);
    } else {
        existingRoom.peer2 = null
        console.log(`Remove peer2 from rooms object`, existingRoom);

    }

    if (existingRoom.peer1 === null && existingRoom.peer2 === null) {
        const existingRoomIndex = constants.rooms.findIndex((room) => room.roomName === roomName);

        if (existingRoomIndex !== -1) {
            constants.rooms.splice(existingRoomIndex, 1);
            console.log(`Remove ${roomName} has been removed`);
        }

    }

    const notificationMessage = {
        label: constants.labels.NORMAL_SERVER_PROCESS,
        data: {
            type: constants.type.ROOM_EXIT.NOTIFY,
            message: `User ${userId} has left`
        }
    }

    sendSocketMessageToUser(otherUserId, notificationMessage);


}

function sendSocketMessageToUser(sendToUserId, message) {
    const userConnection = constants.connections.find(obj => obj.userId === sendToUserId)

    if (userConnection && userConnection.ws) {
        userConnection.ws.send(JSON.stringify(message))
        console.log(`Message send to ${sendToUserId}`)
    } else {
        console.log(`${sendToUserId} User not found!`)

    }
}


function normalServerProcess(data) {
    switch (data.type) {
        case constants.type.ROOM_JOIN.REQUEST:
            joinRoomHandler(data);
            break;

        case constants.type.ROOM_EXIT.EXIT:
            exitRoomHandler(data);
            break;

        case constants.type.ROOM_DESTROY:
        default:
            console.log(`Unknown type`, data.type);

    }

}

function onHandleMessage(message) {

    const data = JSON.parse(message.toString());

    console.log(`onHandleMessage ${constants.labels.NORMAL_SERVER_PROCESS}`);
    console.log(`onHandleMessage ${data.label}`);
    switch (data.label) {
        case constants.labels.NORMAL_SERVER_PROCESS:
            console.log(`=== Server Message ===`);
            normalServerProcess(data.data);
            break;
        default:
            console.log(`Unknown message`, data.data);


    }

}


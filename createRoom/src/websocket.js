import {WebSocketServer} from "ws";
import {rooms} from "./constants.js";

const connections = [];

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

    connections.push({ws, userId});
    console.log(`Server WebSocket connected: ${userId}`);

    ws.on("message", (message) => {
        console.log(`Server Message from ${userId}: ${message.toString()}`);
    });

    ws.on("close", () => {
        const index = connections.findIndex((connection) => connection.ws === ws);
        if (index !== -1) connections.splice(index, 1);
        console.log(`Server WebSocket disconnected: ${userId}`);

        rooms.forEach((room) => {
            if (room.peer1 === userId) {
                room.peer1 = null
            } else if (room.peer2 === userId) {
                room.peer2 = null
            }
            if (room.peer1 === null || room.peer2 === null) {
                const roomIndex = rooms.findIndex((r) => r.roomName === room.roomName);
                if (roomIndex !== -1) {
                    rooms.splice(roomIndex, 1);
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



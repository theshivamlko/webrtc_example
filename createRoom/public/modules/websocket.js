import {WebSocketServer} from "ws";

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

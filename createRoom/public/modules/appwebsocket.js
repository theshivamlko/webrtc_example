import { logToConsole } from "./uiUtils.js";
import { theme } from "./appconstants.js";

export function setupAppWebSocket(wsClient) {
    wsClient.addEventListener("open", () => {
        logToConsole("Connected to the server 🚀");
    });

    wsClient.addEventListener("message", (event) => {
        logToConsole(`Message received: ${event.data}`, theme.green);
    });

    wsClient.addEventListener("close", (event) => {
        logToConsole(`Disconnected from the server (${event.code})`, theme.orange);
    });

    wsClient.addEventListener("error", (event) => {
        console.error("WebSocket connection error:", event);
        logToConsole("WebSocket connection failed", theme.red);
    });
}

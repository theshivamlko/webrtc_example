import {creatorToProceedToRoom, logToConsole} from "./uiUtils.js";
import * as appconstants from "./appconstants.js";
import * as state from "./states.js";

export async function createRoom(roomName, userId) {

    try {
        const response = await fetch("/createRoom", {
            method: "POST",
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                roomName,
                userId,
            })
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.data?.message || `Room request failed (${response.status})`);
        }

        if (body.data.type === appconstants.type.ROOM_CHECK.RESPONSE_SUCCESS) {

            state.setRoomName(roomName)
            logToConsole(`Room Created ${roomName}`,appconstants.theme.green)
            logToConsole(`Waiting for other peer to join`)
            creatorToProceedToRoom()

        } else {
            logToConsole(`Room not available ${roomName}`)
        }

        return body.data;

    } catch (e) {
        console.error("Error: createRoom", e);
        logToConsole(`Error: createRoom ${e}`, appconstants.theme.red)
    }
}
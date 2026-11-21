import http from "http";
import express from "express";
import * as constants from "./src/constants.js";
import {setupWebSocket} from "./src/websocket.js";
import {type} from "./src/constants.js";


const PORT = process.env.PORT || 8080


let app = express();
app.use(express.json());
app.use(express.static("public"));

export const server = http.createServer(app);
setupWebSocket(server);


app.post("/createRoom", (req, res) => {
    const body = req.body;
    console.log("/createRoom data", body)
    const existingRoom = constants.rooms.find(room => {
        return room.roomName === body["roomName"];
    })
    console.log("/createRoom existingRoom", existingRoom)
    if (existingRoom) {
        const failMessage = {
            data: {
                type: type.ROOM_CHECK.RESPONSE_FAILURE,
                message: "Room already created",
            }
        }

        res.status(404).json(failMessage)

    } else {
        constants.rooms.push({
            roomName: body["roomName"],
            peer1: body.userId,
            peer2: null,

        })
        console.log("Room Create, add to array", constants.rooms)
        res.status(200).json({
            data: {
                type: type.ROOM_CHECK.RESPONSE_SUCCESS,

            }
        })


    }

})

app.post("/destroyRoom", (req, res) => {
    const body = req.body;

    const destroyRoom = req.body["roomName"];
    console.log("/destroyRoom data", body)
    const destroyRoomIndex = constants.rooms.findIndex(room => {
        return room.roomName === destroyRoom;
    })
    console.log("/destroyRoom existingRoom", destroyRoom)

    if (destroyRoomIndex === -1) {
        const failMessage = {
            data: {
                type: type.ROOM_DESTROY.RESPONSE_FAILURE,
                message: "Room not found",
            }
        }

        res.status(400).json(failMessage)

    } else {
        constants.rooms.slice(destroyRoomIndex, 1);
        console.log("Room Deleted, from array", constants.rooms)

        res.status(200).json({
            data: {
                type: type.ROOM_DESTROY.RESPONSE_SUCCESS,
                message: "Room Deleted",

            }
        })


    }

})


app.get("/secret", (req, res) => {
    res.send("<h2>hi</h2>")
    // res.json({ message: "Secret route is working" })
})


server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
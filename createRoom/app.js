
import http from "http";
import express from "express";
import { setupWebSocket } from "./public/modules/websocket.js";


const PORT = process.env.PORT || 8080


let app = express();
app.use(express.static("public"));

export const server = http.createServer(app);
setupWebSocket(server);


app.get("/", (req, res) => {
    res.sendFile(process.cwd()+"/index.html")
})

app.get("/secret", (req, res) => {
    res.send("<h2>hi</h2>")
    // res.json({ message: "Secret route is working" })
})



server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
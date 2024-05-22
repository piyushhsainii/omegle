
import { WebSocketServer, WebSocket } from "ws"
import { callManager } from "./CallManager"

const wss = new WebSocketServer({ port: 8080 })


wss.on("connection", (ws: WebSocket) => {
    callManager.addUser(ws)
    ws.on("close", () => {
        console.log("connection closed")
    })
})
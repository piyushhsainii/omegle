import { useEffect, useState } from "react";

export const useSocket = ()=>{

const [socket, setsocket] = useState<WebSocket | null>(null)

useEffect(() => {
try {
    const wss = new WebSocket("ws://localhost:8080")
    setsocket(wss)
} catch (error) {
    console.log(Error)
}

}, [])

return socket
}

import WebSocket from "ws"
import { ANSWER, ICE_CANDIDATES, INIT, OFFER } from "./messages/message"

interface Payload {
    name: string,
    sdp?: string,
    candidate?: string
}


export class Call {

    public user1
    public user2

    constructor(user1: WebSocket, user2: WebSocket) {
        this.user1 = user1
        this.user2 = user2
        this.user1.send(JSON.stringify({
            type: INIT,
            message: "USER1"
        }))

        this.user2.send(JSON.stringify({
            type: INIT,
            message: "USER2"
        }))
    }

    async Offer(user1: WebSocket, user2: WebSocket, payload: Payload) {

        if (payload.name == "USER1") {
            user2.send(JSON.stringify({
                type: OFFER,
                payload: {
                    name: payload.name,
                    sdp: payload.sdp
                }
            }))
        }
        if (payload.name == "USER2") {
            user1.send(JSON.stringify({
                type: OFFER,
                payload: {
                    name: payload.name,
                    sdp: payload.sdp
                }
            }))
        }

    }

    async Answer(user1: WebSocket, user2: WebSocket, payload: Payload) {
        if (payload.name == "USER1") {
            user2.send(JSON.stringify({
                type: ANSWER,
                payload: {
                    name: payload.name,
                    sdp: payload.sdp
                }
            }))
        }
        if (payload.name == "USER2") {
            user1.send(JSON.stringify({
                type: ANSWER,
                payload: {
                    name: payload.name,
                    sdp: payload.sdp
                }
            }))
        }

    }
    async IceCandidates(user1: WebSocket, user2: WebSocket, payload: Payload) {
        if (payload.name == "USER1") {
            user2.send(JSON.stringify({
                type: ICE_CANDIDATES,
                payload: {
                    name: payload.name,
                    candidate: payload.candidate
                }
            }))
        }
        if (payload.name == "USER2") {
            user1.send(JSON.stringify({
                type: ICE_CANDIDATES,
                payload: {
                    name: payload.name,
                    candidate: payload.candidate
                }
            }))
        }

    }


}
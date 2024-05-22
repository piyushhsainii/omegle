import WebSocket from "ws";
import { ANSWER, ICE_CANDIDATES, INIT, OFFER } from "./messages/message";
import { Call } from "./Call";

class CallManager {
    private user1: string;
    private user2: String;
    private calls: Call[]
    private users: WebSocket[]
    private isPending: WebSocket | null
    private static instance: CallManager | null

    private constructor() {
        this.user1 = ''
        this.user2 = ''
        this.isPending = null
        this.users = []
        this.calls = []
    }

    // adding singleton pattern
    static getInstance() {
        if (this.instance) {
            return this.instance
        } else {
            return this.instance = new CallManager()
        }
    }

    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.initCall(socket)
    }

    private initCall(socket: WebSocket) {

        socket.on("message", (data) => {
            const message = JSON.parse(data.toString())
            switch (message.type) {

                case INIT:
                    if (this.isPending) {
                        const newCall = new Call(this.isPending, socket)
                        this.isPending = null
                        this.calls.push(newCall)
                    } else {
                        this.isPending = socket
                        this.user1 = message.name
                    }
                    break;

                case OFFER:
                    const call = this.calls.find((calls) => calls.user1 === socket || calls.user2 === socket)
                    if (call) {
                        call.Offer(call.user1, call.user2, message.payload)
                    }
                    break;
                case ANSWER:
                    const Anscall = this.calls.find((calls) => calls.user1 === socket || calls.user2 === socket)
                    if (Anscall) {
                        Anscall.Answer(Anscall.user1, Anscall.user2, message.payload)
                    }
                    break;
                case ICE_CANDIDATES:
                    console.log(message)
                    const IceCandidate = this.calls.find((calls) => calls.user1 === socket || calls.user2 === socket)
                    if (IceCandidate) {
                        IceCandidate.IceCandidates(IceCandidate.user1, IceCandidate.user2, message.payload)
                    }
                    break;
            }
        })

    }
}

export const callManager = CallManager.getInstance()


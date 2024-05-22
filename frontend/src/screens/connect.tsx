import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { ANSWER, ICE_CANDIDATES, INIT, OFFER } from "@/messages/messages";
import { Navbar } from "@/ui/Navbar";

const Connect = () => {
  const Socket = useSocket();
  const [PC, setPC] = useState<RTCPeerConnection | null>(null)
  const [UserName, setUserName] = useState<string | null>(null)
  const localVideo = useRef<HTMLVideoElement | null>(null)
  const RemoteVideo = useRef<HTMLVideoElement | null>(null)


  const createPeerConnection = (username: string) => {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        Socket?.send(
          JSON.stringify({
            type: ICE_CANDIDATES,
            payload: {
              name: username,
              candidate: event.candidate,
            },
          })
        );
      }
    };

    pc.ontrack = (event) => {
      console.log(event.track, "intrack")
      if (RemoteVideo.current) {
        RemoteVideo.current.srcObject = new MediaStream([
          event.track,
        ])
        RemoteVideo.current.play();
      }
    };


    setPC(pc)

    return pc;
  };

  const createOffer = async (username: string) => {
    const PC = createPeerConnection(username)
    const streams = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })

    const localVideoStream = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })

    if (localVideo.current) {
      localVideo.current.srcObject = new MediaStream([localVideoStream.getTracks()[0]])
    }

    PC.onnegotiationneeded = async () => {
      const offer = await PC.createOffer()
      await PC.setLocalDescription(offer)

      const streams = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streams.getTracks().forEach((track) => PC?.addTrack(track, streams));

      Socket?.send(JSON.stringify({
        type: OFFER,
        payload: {
          name: UserName,
          sdp: offer.sdp
        }
      }))
    }
    console.log(streams.getTracks().map((track) => track))
    streams.getTracks().forEach((track) => PC.addTrack(track, streams));

    // const offer = await PC.createOffer()
    // await PC.setLocalDescription(offer)

    // Socket?.send(JSON.stringify({
    //   type: OFFER,
    //   payload: {
    //     name: username,
    //     sdp: offer.sdp
    //   }
    // }))

  }

  const createAnswer = async (username: string, sdp: any) => {
    await PC?.setRemoteDescription(new RTCSessionDescription(sdp))
    const answer = await PC?.createAnswer()
    await PC?.setLocalDescription(answer)

    Socket?.send(JSON.stringify({
      type: ANSWER,
      payload: {
        name: username,
        sdp: sdp
      }
    }))

  }

  useEffect(() => {
    if (!Socket) return;

    const handleOpen = () => {
      Socket.send(JSON.stringify({ type: INIT }));
    };

    if (Socket.readyState === WebSocket.OPEN) {
      handleOpen();
    } else {
      Socket.addEventListener("open", handleOpen);
    }




    if (PC) {
      PC.onicecandidate = (event: any) => {
        if (event.candidate) {
          Socket.send(JSON.stringify({
            type: ICE_CANDIDATES,
            payload: {
              name: UserName,
              candidate: event.candidate
            }
          }))
        }
      }
    }

    if (PC) {
      PC.ontrack = (event) => {
        console.log(event.track, "intrack")
        if (RemoteVideo.current) {
          RemoteVideo.current.srcObject = new MediaStream([
            event.track,
          ])
          RemoteVideo.current.play();
        }
      }
    }

    Socket.onmessage = (event: any) => {
      const message = JSON.parse(event.data)
      console.log(message)
      switch (message.type) {
        case INIT:
          createOffer(message.message)
          setUserName(message.message)
          break;

        case OFFER:
          createAnswer(message.payload.name, message.payload.sdp)
          if (PC) {
            PC.ontrack = (event: RTCTrackEvent) => {
              if (RemoteVideo.current) {

                RemoteVideo.current.srcObject = new MediaStream([event.track])
                RemoteVideo.current.play()
              }
            }
          }
          break;

        case ANSWER:
          async function setRemoteDesc() {
            await PC?.setRemoteDescription(new RTCSessionDescription(message.payload.sdp));
          }
          setRemoteDesc()
          break;

        case ICE_CANDIDATES:
          async function addIceCandidates() {
            await PC?.addIceCandidate(new RTCIceCandidate(message.payload.sdp));
          }
          addIceCandidates()
          break;
      }

    }
    return () => {
      if (Socket) {
        Socket.removeEventListener("open", handleOpen);
      }
    };

  }, [Socket]);

  return <>
    <Navbar />
    <div>
      <video ref={localVideo} autoPlay playsInline muted />
    </div>
    <div>
      <video ref={RemoteVideo} autoPlay playsInline muted controls />
    </div>
  </>;
};

export default Connect;

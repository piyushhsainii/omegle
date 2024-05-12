import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/ui/Navbar"
import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import { Link } from "react-router-dom"

const Home = () => {

  const [showCam, setshowCam] = useState(false)
  const [isMute, setisMute] = useState<boolean>(true)
  const video = useRef<HTMLVideoElement | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  const getCam = async()=>{
    const cam = await window.navigator.mediaDevices.getUserMedia({video:true})
    const sound = await window.navigator.mediaDevices.getUserMedia({audio:true})
    
    if(video.current){
      video.current.srcObject = new MediaStream([cam.getTracks()[0]])
    }
    if(audio.current){
      audio.current.srcObject = new MediaStream([sound.getTracks()[0]])
    }

  }

  useEffect(() => {
    getCam()
  
  }, [showCam])
  

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-screen justify-center items-center">
        <div className="h-[400px] w-[500px] border-slate-900 border rounded-xl border-opacity-35 flex flex-col justify-start ">
           <div className=" h-[200px] w-[200px] m-auto my-6">
            {
              showCam ?
              <>
                <video 
                  ref={video}
                  autoPlay
                  playsInline
                  className=" m-auto h-[200px] w-[200px] border-slate-900 border border-opacity-35"
                  muted={isMute}
                  src=""  >
               </video> 
                <audio
                ref={audio}
                muted={isMute}
                autoPlay
                playsInline
                >
                </audio>
            </>
              :
              <>
              <div className="border-black border border-opacity-30 ">
                 <img src="image.png" className="h-[200px]  w-[200px] select-none" alt="" />
              </div>
              <audio
                ref={audio}
                muted={isMute}
                autoPlay
                playsInline
                >
                </audio>
              </>
            }
           </div>

           <div className="flex m-auto justify-center my-0 gap-5">
              {
                showCam ? 
                <Video color="green" className="cursor-pointer" onClick={()=>setshowCam((prev)=>!prev)} /> :
                <VideoOff color="red" className="cursor-pointer" onClick={()=>setshowCam((prev)=>!prev)} />
              }
              {
                isMute ?
                <MicOff color="red"  className="cursor-pointer" onClick={()=>setisMute((prev)=>!prev)} /> :
                <Mic color="green"  className="cursor-pointer" onClick={()=>setisMute((prev)=>!prev)} />
              }
           </div>

           <div className=" flex m-auto justify-center my-8 gap-5">
             <Link to={'/connect'}>
              <Button
                className="cursor-pointer select-none bg-green-600 text-white hover:bg-green-700 hover:text-white"  
                variant="outline">Start Video Chat
                </Button>
             </Link>
           </div>

        </div>
      </div>
    </>
  )
}

export default Home
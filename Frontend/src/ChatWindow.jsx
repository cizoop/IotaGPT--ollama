import { useContext,useState,useEffect } from "react";
import Chat from "./Chat.jsx";
import "./ChatWindow.css"
import { MyContext } from "./MyContext.jsx";
import Thread from "../../Backend/models/Thread.js";
import {PropagateLoader} from "react-spinners"

function ChatWindow() {
  const {prompt,setPrompt,reply,setReply,currThreadId,prevChats,setPrevChats,newChat,setNewChat}=useContext(MyContext);
  const [loading,setLoading]=useState(false);
  const [isOpen,setIsOpen]=useState(false);
  

  const getReply= async()=>{
    setLoading(true);
    setNewChat(false);
    console.log("message",prompt," threadid",currThreadId);
   const options={
     method:"POST",
     headers:{
      "Content-type":"application/json"
     },
     body: JSON.stringify({
      message:prompt,
      threadId:currThreadId
     })
   };
   try{
    const response=await fetch("http://localhost:8080/api/chat",options);
    // console.log(response);
    const res= await response.json();
    console.log(res);
    setReply(res.reply);
   }catch(err){
    console.log(err);
   }
   setLoading(false);
  }

 //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);

const handleProfileClick=()=>{
    setIsOpen(!isOpen)
}
return(
<div className="chatWindow">
    <div className="navbar">
    <span>IotaGPT <i className="fa-solid fa-chevron-down"></i></span>
    <div className="userIconDiv" onClick={handleProfileClick}>
        <span className="userIcon">
        <i className="fa-solid fa-user"></i>
        </span>
    </div>
    </div>
    {
        isOpen && 
        <div className="dropDown">
            <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade plan</div>
            <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Settings</div>
            <div className="dropDownItem"><i class="fa-solid fa-right-from-bracket"></i>Log out</div>
        
        </div>
    }
    <Chat></Chat>
    <PropagateLoader color="#fff" loading={loading}></PropagateLoader>
    <div className="chatInput">
     <div className="inputBox">
        <input placeholder="Ask anything"
        value={prompt}
        onChange={(e)=>setPrompt(e.target.value)}
        onKeyDown={(e)=>e.key==='Enter'?getReply():""}
        ></input>
        <div 
        id="submit"
        onClick={getReply}
        ><i className="fa-solid fa-paper-plane"></i></div>
     </div>
     <p className="info">
       IotaGPT can make mistakes, after all made by humans. Check important info. See cookies Preferences.
     </p>
    </div>
</div>
)
  
}

export default ChatWindow;
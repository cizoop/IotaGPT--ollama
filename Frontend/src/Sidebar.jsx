import "./Sidebar.css"
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v4 as uuidv4} from "uuid";
import server from "./environment.js";

function Sidebar() {
  const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(MyContext);
  
  const getAllThreads=async()=>{
    try{
     const response=await fetch(`${server}/api/thread`);
     const res= await response.json();
     const filteredData=res.map(thread=> ({threadId:thread.threadId, title:thread.title}));
     setAllThreads(filteredData);
     console.log(filteredData);
    }catch(err){
      console.log(err);
    }
  };
  useEffect(()=>{
  getAllThreads();
  },[currThreadId])
  
  const createNewChat=()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]);
  }

  const changeThread=async(newThreadId)=>{
     setCurrThreadId(newThreadId);
     try{
       const response=await fetch(`${server}/api/thread/${newThreadId}`);
       const res=await response.json();
       console.log(res);
       setPrevChats(res);
       setNewChat(false);
       setReply(null);
     }catch(err){
      console.log(err);
     }
  }

  const deleteThread=async(threadId)=>{
    try{
    const response=await fetch(`${server}/api/thread/${threadId}`,{method:"DELETE"});
    const res=await response.json();
    console.log(res);
    //updates lidt without refresh
    setAllThreads(prev=>prev.filter(thread=>thread.threadId!==threadId));
    if(threadId===currThreadId){
      createNewChat();
    }
  
    }catch(err){
      console.log(err);
    }
  }
  return (
    <section className="sidebar">
      {/* //new chat option */}
     <button onClick={createNewChat}>
      <img src="src/assets/blacklogo.png" alt="gpt_logo" className="logo"></img>
      <span><i className="fa-solid fa-pen-to-square"></i></span>
     </button>
    {/* //history */}
    <ul className="history">
     {
      allThreads?.map((thread,idx)=>(
        <li 
        key={idx}
        onClick={(e)=>changeThread(thread.threadId)}
        className={thread.threadId===currThreadId?"highlighted":""}
        >
          {thread.title}
          <i 
          className="fa-solid fa-trash"
          onClick={(e)=>{
            e.stopPropagation();
            deleteThread(thread.threadId);
          }}
          >
            </i> 
        </li>
      ))
     }
    </ul>
    {/* //sign */}
    <div className="sign">
      <p>With the help of ollama!! &hearts; </p>
    </div> 
    </section>
  )
}

export default Sidebar;
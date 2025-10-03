import express from "express";
import Thread from "../models/Thread.js";
import getReplyMistral from "../utils/mistral.js";

const router=express.Router();

//test
router.post("/test", async(req,res)=>{
  try{
   const thread=new Thread({
    threadId:"samplexyz1",
    title:"This is test",
   });
   const response=await thread.save();
   res.send(response);
  }catch(err){
   res.status(500).json({error:"Failed to save in db"});
  }
});

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
     const thread = await Thread.findOne({threadId});
     if(!thread){
      res.status(404).json({error:`Thread ${threadId} is not Found`});
     }
     res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error:`Failed to fetch ${threadId} chat`});
    }
});

router.delete("/thread/:threadId",async(req,res)=>{
   const {threadId}=req.params;
   try{
     const thread=await Thread.findOneAndDelete({threadId});
     if(!thread){
        res.status(404).json({error:`Thread ${threadId} is not Found`});
     }
     res.status(200).json({success:"Thread del successfully"});
   }catch(err){
    console.log(err);
    res.status(500).json({error:`Failed to fetch ${threadId} chat`});
   }
});

router.post("/chat",async(req,res)=>{
    const {threadId,message} = req.body;
    if(!threadId || !message)
        res.status(400).json({error:"Invalid credentials"});
    try{
     let thread=await Thread.findOne({threadId});
     if(!thread){
        //if doesnt exists prior 
        thread=new Thread({
            threadId,
            title:message,
            messages:[{role:"user",content:message}]
        })
     }else{
        thread.messages.push({role:"user",content:message});
     }
     const assistantReply = await getReplyMistral(message);
     thread.messages.push({role:"assistant",content:assistantReply});
     thread.updatedAt=new Date(); 
     await thread.save();
     res.json({reply:assistantReply});
    }catch(err){
       console.log(err);
       res.status(500).json({error:"Something went wrong"});
    }
})

router.get("/thread",async(req,res)=>{
    try{
     const threads=await Thread.find({}).sort({updatedAt:-1});
     //descending updatedAt
     res.json(threads);
    }catch(err){
     console.log(err);
     res.status(500).json({error:"Filed to fetch data"});
    }
})

export default router;
// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import mongoose from 'mongoose';
import "dotenv/config";
import chatRoutes from "./routes/chat.js";


const app = express();
const PORT=8080;
app.use(express.json());
app.use(cors());
app.use("/api",chatRoutes);

const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db");
  }catch(err){
    console.log("failed to connect to db",err);
  }
}

// app.post('/chat', async (req, res) => {
//   const userPrompt = req.body.prompt;

//   const ollamaRes = await fetch('http://localhost:11434/api/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: 'llama3',
//       messages: [{ role: 'user', content: userPrompt }],
//       stream: false
//     })
//   });

//   const data = await ollamaRes.json();
//   res.json({ response: data.message.content });
// });

// app.post("/test", async(req,res)=>{
//   const options={
//     method:"POST",
//     headers:{
//         'Content-Type':
//         'application/json'
//     },
//     body: JSON.stringify({
//       model: 'mistral',
//       messages: [{ role: 'user', content:req.body.message}],
//       stream: false
//     })
//   }

//   try{
//    const response=await fetch('http://localhost:11434/api/chat',options);
//    const data = await response.json();
//   //  console.log(data.message.content);
//    res.send(data.message.content);
//   }catch(err){
//    console.log(err);
//   }
// })

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  connectDB();
});

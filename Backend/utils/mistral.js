const getReplyMistral=async(message)=>{
  const options={
      method:"POST",
      headers:{
          'Content-Type':
          'application/json'
      },
      body: JSON.stringify({
        model: 'mistral',
        messages: [{ role: 'user', content:message}],
        stream: false
      })
    }
  
    try{
     const response=await fetch('http://localhost:11434/api/chat',options);
     const data = await response.json();
    //  console.log(data.message.content);
     return data.message.content;//reply
    }catch(err){
     console.log(err);
    }
  }
  
 export default getReplyMistral; 
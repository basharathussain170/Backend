const express=require('express')
const app=express();
const PORT=3000;

const timeLogger=(req,res,next)=>{
  console.log("Time:", new Date().toLocaleDateString());
  next();
}

app.use(timeLogger);

app.use((req,res,next)=>{
  const token=req.headers.authorization
  if(token==="1234"){
    next();
  }else{
    res.status(404).send("You are not valid user So you have not permission to access secret file!")
  }
})

app.get('/secret',(req,res)=>{
  res.send('Secret file Accessed!')
})

app.listen(PORT,()=>{
  console.log(`server is listening on port ${PORT}`)
})
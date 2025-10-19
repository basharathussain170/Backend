const express=require('express')
const app=express();
const PORT=3000


app.use(express.json())

app.use((req,res,next)=>{
  const token=req.headers.authorization
  if(token==="123"){
    next();
  }else{
    res.status(404).send('You are not authorized token!')
  }
})

app.post('/secret',(req,res)=>{
  res.send('You have accessed secret file')
})

app.listen(PORT,()=>{
  console.log('server listening on port 3000')
})

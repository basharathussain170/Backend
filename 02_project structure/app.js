const express=require('express')
const app=express();
const PORT=3000;

const userRouter=require('./routes/userRouter')

app.use(express.json())


app.use('/users',userRouter)

app.use((req,res,next)=>{
  res.send('It is not handle yet!')
})

app.listen(PORT,()=>{
  console.log("Server is listening on port 3000")
})
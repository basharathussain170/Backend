import { useState } from "react"

const Signup=()=>{

  const [inputValue,setInputValue]=useState({name:"",email:"",password:""})
  const handleOnChange=(e)=>{
    setInputValue({...inputValue,[e.target.name]:e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const res=await fetch("http://localhost:3000/api/users/register",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(inputValue),
    })
    // const data=await res.json();
    const data=await res.json();
    console.log(data.user)
  }

  return(
    <>
    <h1>Welcome to the login page!</h1>
    <form  onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter name" name="name" onChange={handleOnChange}/>
      <br /><br />
      <input type="email" placeholder="Enter Email" name="email" onChange={handleOnChange}/>
      <br /><br />
      <input type="password" placeholder="Enter password" name="password" onChange={handleOnChange}/>
      <br /><br />
      <button type="submit">Register</button>
    </form>
    </>
  )
}
export default Signup;
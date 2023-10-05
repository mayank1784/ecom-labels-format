import React, { useEffect, useState } from "react";
import {auth,provider} from "./config";
import {signInWithPopup} from "firebase/auth";
import axios from "axios";
import Cookies from "js-cookie";
import FileUpload from "../FileUpload";

function SignIn(){
    const [value,setValue] = useState('')
    const [data,setData] = useState('')
    const handleClick =async()=>{
        const result = await signInWithPopup(auth,provider);
        const {user} = result;
        setValue(user.email);
        try{
                const response = await axios.post("/api/google-login", {user});
                Cookies.set("sessionToken", response.data.sessionToken, { expires: 7 }); // Expires in 7 days
                console.log(response.data.sessionToken);
            }catch(err){
                console.log("Error sending data to backend", err);
            }
      
    }
    // API request to backend by authorised person where we will send session token in headers
      const getData = async()=>{
          const sessionToken=Cookies.get('sessionToken');
          const requestOptions = {
            method: 'GET', // or 'POST', 'PUT', etc.
            headers: {
              'Authorization': `Bearer ${sessionToken}`, // Include the token in the Authorization header
            },
          };
          console.log("sessionToken:",sessionToken);
          fetch('http://localhost:8000/api/features', requestOptions)
          .then(data => {
            data.json().then((res)=>{
              setData(res.message);
            });
          })
      }

    useEffect(()=>{
        setValue(Cookies.get('sessionToken'));
    },[setValue])

return (
    <div>
        
        <button onClick={handleClick}>Signin With Google</button>
      {/* <button onClick={getData}> get authorised data</button>
      {data!='' ? <h3>{data}</h3> : <></>} */}
      <FileUpload />

    </div>
);
}
export default SignIn;
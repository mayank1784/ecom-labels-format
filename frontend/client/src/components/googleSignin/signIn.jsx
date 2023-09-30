import React, { useEffect, useState } from "react";
import {auth,provider} from "./config";
import {signInWithPopup} from "firebase/auth";
import axios from "axios";
import Cookies from "js-cookie";

function SignIn(){
    const [value,setValue] = useState('')
    const [data,setData] = useState('')
    const handleClick =async()=>{
        const result = await signInWithPopup(auth,provider);
        const {user} = result;
        setValue(user.email);
        try{
                const response = await axios.post("http://localhost:8000/api/google-login", {user});
                Cookies.set("sessionToken", response.data.sessionToken, { expires: 7 }); // Expires in 7 days
                console.log(response.data);
            }catch(err){
                console.log("Error sending data to backend", err);
            }
      
    }
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
          .then(response => response.json())
          .then(data => {
            // Handle the response data
            setData(data.message);
            console.log(data);
          })
          .catch(error => {
            // Handle errors
            console.log(error);
          })
      }

    useEffect(()=>{
        setValue(Cookies.get('sessionToken'));
    },[setValue])

return (
    <div>
        
        <button onClick={handleClick}>Signin With Google</button>
      <button onClick={getData}> get authorised data</button>
      {data!='' ? <h3>data</h3> : <></>}
    </div>
);
}
export default SignIn;
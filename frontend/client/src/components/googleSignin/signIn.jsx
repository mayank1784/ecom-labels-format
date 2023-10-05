import React, { useEffect, useState } from "react";
import {auth,provider} from "./config";
import {signInWithPopup} from "firebase/auth";
import axios from "axios";
import Cookies from "js-cookie";
import FileUpload from "../FileUpload";

function SignIn(){
    const [value,setValue] = useState('')
    const [fileNames, setFileNames] = useState([]);
    
    const handleClick =async()=>{
        const result = await signInWithPopup(auth,provider);
        const {user} = result;
        setValue(user.email);
        try{
                const response = await axios.post("/api/google-login", {user});
                Cookies.set("sessionToken", response.data.sessionToken, { expires: 7 }); // Expires in 7 days
            }catch(err){
                console.log("Error sending data to backend", err);
            }
      
    }
   
    // API request to backend by authorised person where we will send session token in headers
    useEffect(() => {
      // Define a function to fetch file names
      const fetchFileNames = async () => {
        try {
          const sessionToken = Cookies.get('sessionToken');
          const response = await axios.get(`/api/processedPdfNames`,{
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              'Content-Type': 'multipart/form-data', // Set the correct content type
            },});
          setFileNames(response.data);
        } catch (error) {
          console.error('Error fetching file names:', error);
        }
      };
  
      // Call the fetch function
      fetchFileNames();
    },[]);

    

return (
    <div>
        <h1>{value}</h1>
        <button onClick={handleClick}>Signin With Google</button>
      {/* <button onClick={getData}> get authorised data</button>
      {data!='' ? <h3>{data}</h3> : <></>} */}
      <FileUpload />
      <h2>File List</h2>
      <ul>
        {fileNames.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>

    </div>
);
}
export default SignIn;
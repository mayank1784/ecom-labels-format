import axios from "axios";
// might not work when using inside a callback function @@@
import Cookies from "js-cookie";

// auth and firebase imports
import { auth, provider } from "../auth/config";
import { signInWithPopup } from "firebase/auth";
import { userDataType } from "./helperTypes";

// might not work @@@
const sessionToken = Cookies.get("sessionToken");

// Uploads file to backend
export const handleUploadClick = async (selectedFiles: File[], platform: string) => {
  const formData = new FormData();
  selectedFiles.forEach((file: File) => {
    formData.append("pdfFiles", file);
  });
  console.log(formData);
  try {
    const response = await axios.post(`/api/upload/${platform}`, formData, {
      // changed the link here
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    // Not giving anything in return here to the frontend
    throw error;
  }
};

// fetch pdf Uploaded in last 30 mins
export const fetchFileNames = async () => {
  try {
    const sessionToken = Cookies.get("sessionToken");
    const response = await axios.get(`/api/processedPdfNames`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "multipart/form-data", // Set the correct content type
      },
    });
    if (response.status === 200) {
      // console.log("res: ", response.data);
      return response;
    }
    // else{
    //   return
    // }
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Handles if the user is signed in(Registered) or not
export const signInGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const { user } = result;
  try {
    const response = await axios.post("/api/google-login", { user });
    await Cookies.set("sessionToken", response.data.sessionToken, {
      expires: 7,
    }); // Expires in 7 days
  } catch (error) {
    throw error;
  }
};

// Fetches userData for use in different components
export const fetchUserData = async () => {
  const userData: userDataType = await axios.get("/api/getUser", {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  return userData;
};

export const processPdf = async (platform: string, pdfName: string): Promise<Blob> => {
  try {

      const response = await axios.get(`/api/process-pdf/${platform}/${pdfName}`, {
          headers: {
              Authorization: `Bearer ${sessionToken}`,
          },
          responseType: "blob", // Set the response type to 'blob' for file download
      });

      return response.data;
  } catch (error) {
      throw error;
  }
};


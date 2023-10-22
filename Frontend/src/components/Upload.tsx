import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./Upload.scss"; // Import the CSS or SCSS file

function FileUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
 
  const [showProgressBar, setShowProgressBar] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      // Check if adding these files exceeds the maximum limit
    if (selectedFiles.length + files.length > 10) {
      toast.error('You can only select up to 10 files.', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Calculate the total size of selected files
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const newFilesSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);

    // Check if adding these files exceeds the maximum total size (25 MB)
    if (totalSize + newFilesSize > 25 * 1024 * 1024) {
      toast.error('The total size of selected files cannot exceed 25 MB.', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );
      if (pdfFiles.length > 0) {
        setSelectedFiles(pdfFiles);

        // Show the progress bar after 2 seconds
        setTimeout(() => {
          setShowProgressBar(true);
        }, 500);
      // } else {
      //   // Display a message or take appropriate action for invalid file types
      //   toast.error("Add atleast 1 file", {
      //     position: "bottom-center",
      //     autoClose: 3000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //   });
        
      }
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    // Check if there are no files left, and hide the progress bar
  if (updatedFiles.length === 0) {
    setShowProgressBar(false);
  }
    toast.error("File Deleted", {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("pdfFiles", file);
      });
      console.log(formData);
      setSelectedFiles([]);
      setShowProgressBar(false);
      setUploading(true);
      axios
        .post("https://your-api-url.com/api/upload", formData, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          setUploading(false);
        })
        .catch((error) => {
          console.error(error);
          setUploading(false);
        });
    }
  };

  const renderSelectedFiles = () => {
    if (selectedFiles.length > 0) {
      return selectedFiles.map((file, index) => (
        <div key={index} className={`file file--${index}`}>
          <div className="name">
            <span>{file.name}</span>
          </div>
          <div className={`progress ${showProgressBar ? "active" : ""}`}></div>
          <div className="done"></div>
          <button className="importar active" onClick={handleUploadClick}>
            Upload Files
          </button>
          {/* Add a delete button */}
          <i
            className="fa fa-trash delete"
            onClick={() => handleDeleteFile(index)}
          ></i>
        </div>
      ));
    } else {
      return <div>No files selected.</div>;
    }
  };
  
  
  return (
    <div className="upload">
      <div className="upload-files">
        
        <div className={`body ${showProgressBar ? "hidden" : ""}`} id="drop">

          <p className="pointer-none">
            <label htmlFor="fileInput">
              <i
                className="fa fa-file-text-o pointer-none"
                aria-hidden="true"
              ></i>
              <br /> <br />
              <b>Browse Files to upload</b>
            </label>
          </p>
          <input
            type="file"
            id="fileInput"
            multiple
            onChange={handleFileSelect}
            accept=".pdf"
          />
        </div>
        <ToastContainer />
        <footer className={selectedFiles.length > 0 ? "hasFiles" : ""}>
          <div className="divider">
            <span>FILES</span>
          </div>
          <div className="list-files">{renderSelectedFiles()}</div>
        </footer>
      </div>
    </div>
  );
}

export default FileUploader;

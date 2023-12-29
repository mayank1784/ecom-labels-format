import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Stylesheet and Helper function imports
import "./Upload.css";
import { handleUploadClick } from "../helper/helperFunc";

interface FileUploaderProps {
  onUploadCompletion: () => void; // Specify the type for onUploadCompletion prop
  platform: string;
}

function FileUploader({ onUploadCompletion, platform }: FileUploaderProps) {
  // Set file data for uploading
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // for Only UI feature
  const [showProgressBar, setShowProgressBar] = useState(false);

  // Handles selection of multiple files for Uploading
  // Also checking file size, format & number of files
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
      }
    }
  };

  const handleUploadClick__updated = async () => {
    if (selectedFiles.length > 0) {
      // Imported from helper Function
      await handleUploadClick(selectedFiles,platform);
      // Notify parent component about upload completion
      onUploadCompletion();
      setSelectedFiles([]);
      setShowProgressBar(false);
    }
  }

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

  const renderSelectedFiles = () => {
    if (selectedFiles.length > 0) {
      return selectedFiles.map((file, index) => (
        <div key={index} className={`file file--${index}`}>
          <div className="name">
            <span>{file.name}</span>
          </div>
          <div className={`progress ${showProgressBar ? "active" : ""}`}></div>
          <div className="done"></div>
          <button className="importar active" onClick={handleUploadClick__updated}>
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
      return (
        <div>No files selected.</div>
      )
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

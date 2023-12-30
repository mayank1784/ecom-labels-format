import { useParams } from "react-router";
import { propTypeTwo } from "../helper/helperTypes";
import { useEffect, useState } from "react";
import { processPdf } from "../helper/helperFunc";
import { useNavigate } from "react-router-dom";
import "./Loading.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loading = () => {
  const { platform, pdfName } = useParams<propTypeTwo>() as {
    platform: string;
    pdfName: string;
  };

  const [loading, setLoading] = useState<Boolean>(true);
  const [pdfLink, setPdfLink] = useState<string>("");

  const navigate = useNavigate();

  const handleDownload = () => {
    // Redirect to previous page when download link is clicked
    alert("File Download started.")
    navigate(-1);
  };

  useEffect(() => {
    let isMounted = true;
    let errorShown = false;

    const fetchData = async () => {
      try {
        const processedPdf = await processPdf(platform, pdfName);
        const blob = new Blob([processedPdf], { type: "application/pdf" });
        const pdfUrl = window.URL.createObjectURL(blob);

        if (isMounted) {
          setPdfLink(pdfUrl);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error downloading processed PDF:", error);
        // Handle error only if not already shown
        if (!errorShown && isMounted) {
          errorShown = true;
          toast.error("Error downloading processed PDF", {
            position: "top-center",
          });
          setTimeout(() => {
            navigate(-1); // Redirect to previous page after a slight delay
          }, 1600);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Clean up to avoid state updates on unmounted components
    };
  }, [platform, pdfName, navigate]);

  return (
    <div className="loadingContainer">
      <ToastContainer />
      {loading ? (
        <>
        
        
        <div id="wifi-loader">
    <svg className="circle-outer" viewBox="0 0 86 86">
        <circle className="back" cx="43" cy="43" r="40"></circle>
        <circle className="front" cx="43" cy="43" r="40"></circle>
        <circle className="new" cx="43" cy="43" r="40"></circle>
    </svg>
    <svg className="circle-middle" viewBox="0 0 60 60">
        <circle className="back" cx="30" cy="30" r="27"></circle>
        <circle className="front" cx="30" cy="30" r="27"></circle>
    </svg>
    <svg className="circle-inner" viewBox="0 0 34 34">
        <circle className="back" cx="17" cy="17" r="14"></circle>
        <circle className="front" cx="17" cy="17" r="14"></circle>
    </svg>
</div>
<h2>Your PDF is loading. Please wait...</h2>
</>
      ) : (
        <>
        <button className="download-btn">
        <a href={pdfLink} download="LS_Processed.pdf" onClick={handleDownload}>
          Download Processed PDF
        </a></button>
       
        </>
      )}
    </div>
  );
};

export default Loading;

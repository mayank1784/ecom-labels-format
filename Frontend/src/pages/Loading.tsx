import { useParams } from "react-router";
import { propTypeTwo } from "../helper/helperTypes";
import { useEffect, useState } from "react";
import { processPdf } from "../helper/helperFunc";
import { useNavigate } from "react-router-dom";

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
    <div>
      <ToastContainer />
      {loading ? (
        <p>Your PDF is loading. Please wait...</p>
      ) : (
        <a href={pdfLink} download="LS_Processed.pdf">
          Download Processed PDF
        </a>
      )}
    </div>
  );
};

export default Loading;

import { useParams } from "react-router"
import { propTypeTwo } from "../helper/helperTypes";
import { useEffect, useState } from "react";
import { processPdf } from "../helper/helperFunc";

const Loading = () => {
    
    const { platform, pdfName } = useParams<propTypeTwo>();
    const [loading, setLoading] = useState<Boolean>(true);
    const [pdfLink, setPdfLink] = useState<string>("");

    

    useEffect(() => {
        
    
        const fetchData = async () => {
          try {
            const processedPdf = await processPdf(platform, pdfName);
    
            const blob = new Blob([processedPdf], { type: "application/pdf" });
            const pdfUrl = window.URL.createObjectURL(blob);
    
            setPdfLink(pdfUrl);
            setLoading(false);
          } catch (error) {
            console.error('Error downloading processed PDF:', error);
            // Handle error
          }
        };
    
        fetchData();
      }, [platform, pdfName]);

    return (
    <div>
      {loading ? (
        <p>Your PDF is loading. Please wait...</p>
      ) : (
        <a href={pdfLink} download="processed_pdf.pdf">
          Download Processed PDF
        </a>
      )}
    </div>
    );
}

export default Loading
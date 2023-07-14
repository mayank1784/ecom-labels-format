import fs from "fs";
import PDFParser from "pdf2json";

// Function to sort the PDF pages based on a specific line
// Function to sort the PDF pages based on a specific line
async function sortPDFPagesByLine(pdfPath, targetLine) {
    try {
      // Read the PDF file
      const pdfData = fs.readFileSync(pdfPath);
  
      // Create a new PDFParser instance
      const pdfParser = new PDFParser();
  
      // Register event handlers for parsing
      pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => {
        const pageCount = pdfData.pages.length;
        console.log(pageCount);
  
        const pageTexts = [];
  
        for (let pageNum = 0; pageNum < pageCount; pageNum++) {
          const page = pdfData.pages[pageNum];
          const lines = page.Texts.map(text => decodeURIComponent(text.R[0].T));
          const requiredLine = lines[targetLine - 1];
          console.log(requiredLine);
          pageTexts.push(requiredLine);
        }
  
        console.log(pageTexts);
  
        // Sort the page numbers based on the extracted text
        const sortedPageNumbers = pageTexts
          .map((_, index) => index + 1)
          .sort((a, b) => {
            const textA = pageTexts[a - 1].toLowerCase();
            const textB = pageTexts[b - 1].toLowerCase();
            return textA.localeCompare(textB);
          });
  
        console.log(sortedPageNumbers);
  
        // Rest of your code for creating a sorted PDF
  
        console.log(`PDF pages sorted and saved to ${outputPath}`);
      });
  
      // Load and parse the PDF data
      pdfParser.parseBuffer(pdfData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  
  // Usage: Provide the path to the PDF file and the target line to sort by
  const pdfPath = "./public/input/fileInput1.pdf";
  const targetLine = 7;
  sortPDFPagesByLine(pdfPath, targetLine);
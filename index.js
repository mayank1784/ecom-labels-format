const { PDFDocument } = require("pdf-lib");
const PDFParse = require("pdf-parse");
const fs = require("fs");
function filterArrayBySKUID(arr) {
  const filteredArray = [];
  const length = arr.length;
  
  for (let i = 0; i < length; i++) {
    if (arr[i].includes("SKU")) {
      if (i + 1 < length) {
        filteredArray.push(arr[i + 1]);
      }
    }
  }
  
  return filteredArray;
}
function filterArrayBySKUIDAmazon(arr) {
  const filteredArray = [];
  const length = arr.length;
  
  for (let i = 0; i < length; i++) {
    if (arr[i].includes("HSN")) {
      if (i - 1 != 0) {
        filteredArray.push(arr[i - 1]);
      }
    }
  }
  
  return filteredArray;
}
// Function to sort the PDF pages based on a specific line
async function sortPDFPagesByLine(pdfPath, targetLine) {
  try {
    // Read the PDF file
    const pdfData = fs.readFileSync(pdfPath);

    // Parse the PDF to extract the text content
    const pdf = await PDFParse(pdfData);
    
    const pageCount = pdf.numpages;
    console.log(pageCount);
    let pageTexts = [];
    const pageData = await PDFParse(pdfData); 
    const lines = pageData.text.trim().split("\n");
    console.log(lines);
    pageTexts = filterArrayBySKUID(lines);
    
    // for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    //   const pageData = await PDFParse(pdfData, { pagerender: pageNum });
    //   console.log(pageData.numpages);
    // // console.log(pageData.text);
    //   let lines = pageData.text.trim().split("\n");
    //   lines = filterArrayBySKUID(lines);
    //   console.log(lines);
    //   const requiredLine = lines[targetLine-1];
    //   console.log(requiredLine);
    //   pageTexts.push(requiredLine);
    // }
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
    // Create a new PDF with the sorted pages
    const sortedPdf = await PDFDocument.create();
    const existingPdf = await PDFDocument.load(pdfData);
    
    for (const pageNumber of sortedPageNumbers) {
      const [existingPage] = await sortedPdf.copyPages(existingPdf, [pageNumber - 1]);
      sortedPdf.addPage(existingPage);
    }

    // Save the sorted PDF to a new file
    const outputPath = "./public/output/fin2-out.pdf";
    const sortedPdfBytes = await sortedPdf.save();
    fs.writeFileSync(outputPath, sortedPdfBytes);

    console.log(`PDF pages sorted and saved to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Usage: Provide the path to the PDF file and the target line to sort by
const pdfPath = "./public/input/metest.pdf";
const targetLine = 7;
sortPDFPagesByLine(pdfPath, targetLine);

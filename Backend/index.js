const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const PDFParse = require("pdf-parse");
// const pdfjs = require('pdfjs-dist');
const PDFJS = require("pdfjs-dist/build/pdf.js");
const { PDFNet } = require('@pdftron/pdfnet-node');



const fs = require("fs");
const ama = "Description";
const other = "\n";

function filterArrayBySKUID(arr) {
  const filteredArray = [];
  const length = arr.length;

  for (let i = 0; i < length; i++) {
    if (arr[i].includes("SKU")) {
      if (i + 1 < length) {
        filteredArray.push(arr[i + 1].replace(/\s+/g, ""));
      }
    }
  }

  return filteredArray;
}

function filterArrayBySKUIDAmazon(arr) {
  let filteredArray = [];
  const length = arr.length;
// console.log("aRR",arr);
  for (let i = 0; i < length; i++) {
    let temp = arr[i].split("HSN");
    // console.log("HSN Split", temp);

    const tempLength = temp.length;
    let tempFilteredArray = [];
    for (let j = 0; j < tempLength; j++) {
      const cleanedString = temp[j].replace(/\s+(?=\))/g, "");
      const startIndex = cleanedString.lastIndexOf("(") + 1;
      const endIndex = cleanedString.indexOf(")", startIndex);
      const substring = cleanedString.substring(startIndex, endIndex).trim();
      const rupeeSymbolRegex = /₹(.*?)₹/;
      const match = cleanedString.match(rupeeSymbolRegex);
      let qty = match ? match[1] : null;
      tempFilteredArray.push(substring);
      if (qty != null) qty = qty[qty.length - 1];
      tempFilteredArray.push(qty);
     
    }
    filteredArray.push(tempFilteredArray);
    
  }
  console.log(filteredArray);
  const cleanedArray = filteredArray
    .map((subarray) =>
      subarray.filter(
        (item) =>
          item !== null &&
          !item.includes("Amazon Retail India Pvt. Ltd") &&
          item.length > 0
      )
    )
    .filter((subarray) => subarray.length > 0);
  return cleanedArray;
}

// Function to sort the PDF pages based on a specific line
async function sortPDFPagesByLine(pdfPath, platform) {
  try {
    // Read the PDF file
    const pdfData = fs.readFileSync(pdfPath);
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 
 

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const pdf = await PDFParse(pdfData);
    let lines = [];
    const pageCount = pdf.numpages;
    console.log(pageCount);
    let pageTexts = [];
    const pageData = await PDFParse(pdfData);
    // if (platform==="flip"){
    //   console.log(pageData.text);
    // }
    if (platform === "amazon") {
      lines = pageData.text.trim().split(ama);
    } else {
      lines = pageData.text.trim().split(other);
    }
    console.log("lines length: ", lines.length);
    if (platform === "amazon") {
      pageTexts = filterArrayBySKUIDAmazon(lines);
    } else {
      pageTexts = filterArrayBySKUID(lines);
    }
    console.log(pageTexts);//Sku array 
    console.log("pageText len ", pageTexts.length);
    //Sort the page numbers based on the extracted text
    let sortedPageNumbers = [];
    if (platform === "amazon") {
      sortedPageNumbers = pageTexts
        .map((_, index) => index * 2 + 1) // Adjust page numbers based on assumption
        .sort((a, b) => {
          const textA = pageTexts[Math.floor((a - 1) / 2)][0].toLowerCase(); // Adjust index for textA
          const textB = pageTexts[Math.floor((b - 1) / 2)][0].toLowerCase(); // Adjust index for textB
          return textA.localeCompare(textB);
        });
    } else {
      sortedPageNumbers = pageTexts
        .map((_, index) => index + 1)
        .sort((a, b) => {
          const textA = pageTexts[a - 1].toLowerCase();
          const textB = pageTexts[b - 1].toLowerCase();
          return textA.localeCompare(textB);
        });
    }
    console.log(sortedPageNumbers);
    // Create a new PDF with the sorted pages
    const sortedPdf = await PDFDocument.create();
    const existingPdf = await PDFDocument.load(pdfData);

    for (const pageNumber of sortedPageNumbers) {
      const [existingPage] = await sortedPdf.copyPages(existingPdf, [
        pageNumber - 1, // Adjust the page number by subtracting 1
      ]);
      sortedPdf.addPage(existingPage);
      if (platform==="amazon"){
      const pageIndex = Math.floor((pageNumber - 1) / 2); // Adjust index for pageTexts
      const text = pageTexts[pageIndex].join(" :: "); // Get the corresponding text from pageTexts

      const timesRomanBoldFont = await sortedPdf.embedFont(StandardFonts.TimesRomanBold)
      const { width, height } = existingPage.getSize();
      const fontSize = 16;
      const textX = 50;
      const textY = 150;

      const page = sortedPdf.getPages().pop(); // Get the last added page
      page.drawText(text, {
        x: textX,
        y: textY,
        size: fontSize,
        font: timesRomanBoldFont,
      });
    }}

    // Save the sorted PDF to a new file
    const outputPath = "./public/output/ama_12.pdf";
    const sortedPdfBytes = await sortedPdf.save();
    fs.writeFileSync(outputPath, sortedPdfBytes);

    ////////////////////////////////////////////////////////////////////////////////////////////
  //   await PDFNet.initialize("demo:1696681505415:7cef259c0300000000284d26b8d9353df9ad931f1d36c1c432b6231b2d");
  //   try{
  //     const doc = await PDFNet.PDFDoc.createFromFilePath(outputPath);
  //     const flipcrop = {
  //       x1: 187.90,
  //       y1: 460.78,
  //       x2: 405.4,
  //       y2: 815.08
  //     };
  //     const meecrop = {
  //       x1: 0,
  //       y1: 434.18,
  //       x2: 594.72,
  //       y2: 841.68
  //     }
  //   const page_num = await doc.getPageCount();
  // for (let i = 1; i <= page_num; ++i) {
  //   const page = await doc.getPage(i);
  //   page.setCropBox(new PDFNet.Rect(flipcrop.x1, flipcrop.y1, flipcrop.x2, flipcrop.y2));
  // }
  // await doc.save("./public/output/ama_12.pdf", PDFNet.SDFDoc.SaveOptions.e_linearized);
  // console.log('PDF cropped successfully!');
  // PDFNet.shutdown();
  // } catch (err){console.error(err)} 
/////////////////////////////////////////////////////////////////////////////////////////////////////  

    console.log(`PDF pages sorted and saved to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Usage: Provide the path to the PDF file and the target line to sort by
const pdfPath = "./public/input/ama_12.pdf";
sortPDFPagesByLine(pdfPath, "amazon");

// pdfController.js
const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const PDFParse = require("pdf-parse");
const PDFJS = require("pdfjs-dist/build/pdf.js");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////   Some Internal Functions to filter the pdf data   ///////////////////////////////////////

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

  for (let i = 0; i < length; i++) {
    let temp = arr[i].split("HSN");

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to merge and save PDFs
async function mergePDFs(req, res) {
  try {
    const pdfFiles = req.files; // Use 'pdfFiles' as the key to extract the array of files
    const platform = req.params.platform

    if (!pdfFiles) {
      return res.status(400).json({ message: "No PDF files uploaded" });
    }

    // Initialize a new PDF document
    const mergedPDF = await PDFDocument.create();

    // Iterate through the uploaded PDF files
    for (const pdfFile of pdfFiles) {
      const pdfBytes = pdfFile.buffer; // Access the 'buffer' property to get file data
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Append each page to the merged PDF document
      const copiedPages = await mergedPDF.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => {
        mergedPDF.addPage(page);
      });
    }

    // Generate a unique filename (e.g., timestamp-based)
    const uniqueFilename = `${req.user.uid}_merged_${Date.now()}_${platform}.pdf`;
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      uniqueFilename
    );

    // Save the merged PDF to a file in public/uploads
    const mergedPDFBytes = await mergedPDF.save();
    fs.writeFileSync(filePath, mergedPDFBytes);

    // Respond with the path to the saved PDF
    res.status(200).json({
      message: "PDF uploaded successfully",
      pdfName: `${uniqueFilename}`,
    });
  } catch (error) {
    console.error("Error merging and saving PDFs:", error);
    res.status(500).json({ message: "Error merging and saving PDFs" });
  }
}

//Function to sort pdf on the given platform
async function sortPdf(req, res) {
  const platform = req.params.platform;
  const pdfName = req.params.pdfName;
  const outputPdfName = `${pdfName.substring(0,pdfName.lastIndexOf(".pdf"))}_sorted_${platform}.pdf`;
  // Define the paths to the merged PDF and the output PDF
  const foundPdf = path.join(__dirname, "..", "public", "uploads", pdfName);
  const outputPath = path.join(
    __dirname,
    "..",
    "public",
    "output",
    outputPdfName
  );

  // Check if a processed PDF already exists
  if (fs.existsSync(outputPath)) {
    // If it exists, send it for download
    res.setHeader("Content-Disposition", `attachment; filename=${outputPdfName}`);
    res.setHeader("Content-Type", "application/pdf");
    const downloadPdfStream = fs.createReadStream(outputPath);
    downloadPdfStream.pipe(res);
    return;
  }
  // Read the merged PDF file
  try {
    const mergedPdfBuffer = fs.readFileSync(foundPdf);
    const ama = "Description";
    const other = "\n";
    const pdf = await PDFParse(mergedPdfBuffer);
    let lines = [];
    const pageCount = pdf.numpages;
    console.log(pageCount);
    let pageTexts = [];
    const pageData = await PDFParse(mergedPdfBuffer);

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
    console.log(pageTexts); //Sku array
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
    const existingPdf = await PDFDocument.load(mergedPdfBuffer);

    for (const pageNumber of sortedPageNumbers) {
      const [existingPage] = await sortedPdf.copyPages(existingPdf, [
        pageNumber - 1, // Adjust the page number by subtracting 1
      ]);
      sortedPdf.addPage(existingPage);
      if (platform === "amazon") {
        const pageIndex = Math.floor((pageNumber - 1) / 2); // Adjust index for pageTexts
        const text = pageTexts[pageIndex].join(" :: "); // Get the corresponding text from pageTexts

        const timesRomanBoldFont = await sortedPdf.embedFont(
          StandardFonts.TimesRomanBold
        );
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
      }
    }
    const sortedPdfBytes = await sortedPdf.save();
    fs.writeFileSync(outputPath, sortedPdfBytes);
    // Send the modified PDF as a downloadable response
    res.setHeader("Content-Disposition", `attachment; filename=${outputPdfName}`);
    res.setHeader("Content-Type", "application/pdf");
    const modifiedPdfStream = fs.createReadStream(outputPath);
    modifiedPdfStream.pipe(res);
  } catch (err) {
    console.error("Error processing PDF:", err);
    res.status(500).json({ message: "Error processing PDF" });
  }
}

async function getPdfNames(req, res) {
  const uploadsFolderPath = path.join(__dirname, "..", "public", "uploads"); // Replace with the path to your uploads folder

  // Read the files in the uploads folder
  fs.readdir(uploadsFolderPath, (err, files) => {
    const userId = req.user.uid;
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ message: "Error fetching files" });
    }

    // Filter files based on userId and get their stats
    const filteredFiles = files.filter((file) => file.startsWith(userId));

    // Create an array of file objects with name and birthtime
    const fileObjects = filteredFiles.map((file) => {
      const filePath = path.join(uploadsFolderPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        birthtime: stats.birthtime,
      };
    });

    // Sort the file objects by birthtime in descending order
    const sortedFiles = fileObjects.sort((a, b) => b.birthtime - a.birthtime);

    // Extract and send only the sorted file names
    const sortedFileNames = sortedFiles.map((file) => file.name);

    res
      .status(200)
      .json({
        message: "PDF names retrieved successfully",
        data: sortedFileNames,
      });
  });
}

module.exports = {
  mergePDFs,
  sortPdf,
  getPdfNames,
};

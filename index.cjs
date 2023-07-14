import express from "express";
import { readFile } from 'fs/promises';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import pdfjsLib from 'pdfjs-dist/es5/build/pdf';
const app = express();
const inputPath = './public/input/fileInput1.pdf';
// const existingPdfBytes = new Uint8Array(await readFile(inputPath));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

async function calculateCoordinates(pdfBytes) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
  
    const desiredPageNumber = 0; // Specify the page number you want to calculate coordinates on
  
    const desiredWidthInPoints = 190.1; // Desired width in points
    const desiredHeightInPoints = 15.8; // Desired height in points
  
    const page = pdfDoc.getPages()[desiredPageNumber];
  
    const pageWidth = page.getWidth(); // Page width in points
    const pageHeight = page.getHeight(); // Page height in points
  
    const desiredX = 197.3; // Desired X coordinate
    const desiredY = 287.3; // Desired Y coordinate
  
    const xRatio = desiredX / pageWidth;
    const yRatio = 1 - desiredY / pageHeight;
  
    const actualX = xRatio * desiredWidthInPoints;
    const actualY = yRatio * desiredHeightInPoints;
  
    console.log(`Actual X coordinate: ${actualX}`);
    console.log(`Actual Y coordinate: ${actualY}`);
  }
  

  async function getTextFromCoordinates(pdfBytes) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
  
    const pageCount = pdfDoc.getPageCount();
  
    for (let i = 0; i < pageCount; i++) {
        const pdfData = await pdfDoc.saveAsBase64({ dataUri: true });
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const page = await pdf.getPage(i + 1);

    const viewport = page.getViewport({ scale: 1 });
      
  
      const textContent = await page.getTextContent();
      const { items } = textContent;
  
      const desiredCoordinates = { x: 197.3, y: 287.3 }; // Example coordinates
  
      const matchingItems = items.filter(({ transform }) => {
        const [x, y] = transform;
  
        // Modify the comparison logic based on your specific coordinates
        return x >= desiredCoordinates.x && x <= desiredCoordinates.x + 190.1 &&
               y >= desiredCoordinates.y && y <= desiredCoordinates.y + 15.8;
      });
  
      const extractedText = matchingItems.map(({ str }) => str).join('');
  
      console.log(`Text from page ${i + 1}: ${extractedText}`);
    }
  }
  
  // Usage example:
  const existingPdfBytes = new Uint8Array(await readFile(inputPath));;
  
  getTextFromCoordinates(existingPdfBytes)
    .catch((error) => {
      console.log('Error:', error);
    });



(async () => {
  const existingPdfBytes = new Uint8Array(await readFile(inputPath));

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  console.log(firstPage);

  const { width, height } = firstPage.getSize();
  console.log("width:", width);
  console.log("height:", height);

  firstPage.drawText('This text was added with JavaScript!', {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  });

  const pdfBytes = await pdfDoc.save();

  // For example, `pdfBytes` can be:
  //   • Written to a file in Node
  //   • Downloaded from the browser
  //   • Rendered in an <iframe>
});

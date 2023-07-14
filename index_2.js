
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PDFLib = require('pdf-lib');
const PDFJS = require('pdfjs-dist');

async function extractContentFromBlock(pdfBytes) {
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPages()[i];
    const { width, height } = page.getSize();

    const desiredX = 197.3; // Desired starting X coordinate
    const desiredY = 287.3; // Desired starting Y coordinate
    const blockWidth = 190.1; // Block width
    const blockHeight = 15.8; // Block height

    const desiredXPoint = (desiredX / width) * 612; // 612 is the default PDF unit (1 point = 1/72 inch)
    const desiredYPoint = height - (desiredY / height) * 792; // 792 is the default PDF unit (1 point = 1/72 inch)
    const blockWidthPoint = (blockWidth / width) * 612;
    const blockHeightPoint = (blockHeight / height) * 792;

    const pdfData = await pdfDoc.saveAsBase64({ dataUri: true });
    const pdf = await PDFJS.getDocument({ data: pdfData }).promise;
    const pdfPage = await pdf.getPage(i + 1);

    const viewport = pdfPage.getViewport({ scale: 1 });

    const textContent = await pdfPage.getTextContent();
    const items = textContent.items;

    const matchingItems = items.filter((item) => {
      const { transform } = item;
      console.log(transform);
      const [x, y] = transform;
      const [xScale, yScale] = transform.slice(2, 4);

      const actualX = (x * xScale) + viewport.transform[4];
      const actualY = (y * yScale) + viewport.transform[5];

      // Modify the comparison logic based on the desired block coordinates
      return (
        actualX >= desiredXPoint &&
        actualX <= desiredXPoint + blockWidthPoint &&
        actualY >= desiredYPoint &&
        actualY <= desiredYPoint + blockHeightPoint
      );
    });

    const extractedText = matchingItems.map(({ str }) => str).join('');
    console.log(`Text from page ${i + 1}: ${extractedText}`);
  }
}

// Usage example:
const fs = require('fs');
const existingPdfBytes = fs.readFileSync('./public/input/fin2.pdf');

extractContentFromBlock(existingPdfBytes)
  .catch((error) => {
    console.log('Error:', error);
  });


  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
  

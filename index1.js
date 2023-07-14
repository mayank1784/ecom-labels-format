const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


    
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const pdfjs = require('pdfjs-dist');
const pdfParse = require('pdf-parse');

// async function extractTextFromBlock(page, blockCoordinates) {
//   const viewport = page.getViewport({ scale: 1 });
//   const textContent = await page.getTextContent();
//   for (const [index, item] of textContent.items.entries()) {
//     const { transform, str } = item;
//     if (index>=177 && index<=187){
//     console.log('Page:', page._pageIndex);
//     console.log('Text:', str);
//     console.log('Transform:', transform);
//     console.log('index:', index);
//         }    }
  
// // //   for (const item of textContent.items) {
// // //     const { transform, str } = item;
// // //     console.log('Text:', str);
// // //     console.log('Transform:', transform);
// //   }


//   const blockText = [];
//   for (const item of textContent.items) {
//     const { transform, str } = item;
//     const { x, y } = transform;

//     if (
//       x <= blockCoordinates.bottomLeft.x &&
//       x <= blockCoordinates.bottomRight.x &&
//       y <= blockCoordinates.bottomLeft.y &&
//       y <= blockCoordinates.topLeft.y
//     ) {
//       blockText.push(str);
//     }
//   }
// console.log(blockText);
//   return blockText.join(' ');
// }
// // async function extractTextFromBlock(page, blockCoordinates) {
// //     const textContent = await page.getTextContent();
// //     const blockText = [];
  
// //     for (const item of textContent.items) {
// //       const { transform, str } = item;
// //       const { x, y } = transform;
  
// //       if (
// //         x >= blockCoordinates.bottomLeft.x &&
// //         x <= blockCoordinates.topRight.x &&
// //         y >= blockCoordinates.bottomLeft.y &&
// //         y <= blockCoordinates.topRight.y
// //       ) {
// //         blockText.push(str);
// //       }
// //     }
  
// //     return blockText.join(' ');
// //   }
  
// async function rearrangePagesByBlockCoordinates(inputPath, outputPath, blockCoordinates) {
//   const fileData = new Uint8Array(await fs.promises.readFile(inputPath));
//   const pdf = await pdfjs.getDocument(fileData).promise;

//   const pageBlocks = [];
//   for (let i = 0; i < pdf.numPages; i++) {
//     const page = await pdf.getPage(i + 1);
//     const block = await extractTextFromBlock(page, blockCoordinates);
//     pageBlocks.push({ pageIndex: i, block });
//   }
// console.log(pageBlocks);
//   pageBlocks.sort((a, b) => {
//     if (!a.block) return 1;
//     if (!b.block) return -1;
//     return a.block.localeCompare(b.block); // Sort by block text
//   });
//   console.log(pageBlocks);
//   const newPdfDoc = await PDFDocument.create();
//   for (const pageBlock of pageBlocks) {
//     const { pageIndex } = pageBlock;
//     const [copiedPage] = await newPdfDoc.copyPages(pdf, [pageIndex + 1]);
//     newPdfDoc.addPage(copiedPage);
//   }

//   const modifiedPdfBytes = await newPdfDoc.save();
//   await fs.promises.writeFile(outputPath, modifiedPdfBytes);
// }

// // Example usage
// const inputPath = './public/input/fileInput1.pdf';
// const outputPath = './public/output/output1.pdf';
// const blockCoordinates = {
//   topLeft: { x: 54.75, y: 299},
//   bottomLeft: { x: 54.75 , y: 299 },
//   topRight: { x: 54.75, y: 299 },
//   bottomRight: { x: 54.75, y: 299 },
// };

// rearrangePagesByBlockCoordinates(inputPath, outputPath, blockCoordinates)
//   .then(() => {
//     console.log('PDF rearranged successfully!');
//   })
//   .catch((error) => {
//     console.error('Error rearranging PDF:', error);
//   });






async function extractTextFromBlock(pageContent, pageSize) {
  let captureText = false;
  const blockText = [];

  for (const item of pageContent) {
    const { x, y, str } = item;
    console.log("x:",x);
    console.log("str:", str)

    if (str.includes('1')) {
      captureText = true;
      continue; // Skip capturing the "SKU" itself
    }
console.log("pagewidth:", pageSize.width);
    if (captureText && x > pageSize.width / 3.03) {
      blockText.push(str);
    }
  }

  return blockText.join(' ');
}

async function rearrangePagesBySKU(inputPath, outputPath) {
  const dataBuffer = await fs.promises.readFile(inputPath);
  const pdfData = await pdfParse(dataBuffer);

  const pageBlocks = [];
  for (let i = 0; i < pdfData.numPages; i++) {
    const pageContent = pdfData.pages[i].Texts;
    console.log("page content: ", pageContent);
    const pageSize = pdfData.pages[i].width > pdfData.pages[i].height
      ? { width: pdfData.pages[i].width, height: pdfData.pages[i].height }
      : { width: pdfData.pages[i].height, height: pdfData.pages[i].width };
      console.log("page size: ", pageSize);
    const block = await extractTextFromBlock(pageContent, pageSize);
    console.log(block);
    pageBlocks.push({ pageIndex: i, block });
  }
console.log(pageBlocks);
  pageBlocks.sort((a, b) => {
    if (!a.block) return 1;
    if (!b.block) return -1;
    return a.block.localeCompare(b.block); // Sort by block text
  });
console.log(pageBlocks);
  const newPdfDoc = await PDFDocument.create();
  for (const pageBlock of pageBlocks) {
    const { pageIndex } = pageBlock;
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
    newPdfDoc.addPage(copiedPage);
  }

  const modifiedPdfBytes = await newPdfDoc.save();
  await fs.promises.writeFile(outputPath, modifiedPdfBytes);
}

  
  // Example usage
  const inputPath = './public/input/fileInput1.pdf';
  const outputPath = './public/output/output.pdf';
  
  rearrangePagesBySKU(inputPath, outputPath)
    .then(() => {
      console.log('PDF rearranged successfully!');
    })
    .catch((error) => {
      console.error('Error rearranging PDF:', error);
    });
  
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

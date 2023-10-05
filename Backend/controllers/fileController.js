// pdfController.js
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Function to merge and save PDFs
async function mergePDFs(req, res) {
  try {
    const pdfFiles = req.files; // Use 'pdfFiles' as the key to extract the array of files

    if (!pdfFiles) {
      return res.status(400).json({ error: 'No PDF files uploaded' });
    }

    // Initialize a new PDF document
    const mergedPDF = await PDFDocument.create();

    // Iterate through the uploaded PDF files
    for (const pdfFile of pdfFiles) {
      const pdfBytes = pdfFile.buffer; // Access the 'buffer' property to get file data
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Append each page to the merged PDF document
      const copiedPages = await mergedPDF.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPDF.addPage(page);
      });
    }

    // Generate a unique filename (e.g., timestamp-based)
    const uniqueFilename = `${req.user.uid}_merged_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'public', 'uploads', uniqueFilename);

    // Save the merged PDF to a file in public/uploads
    const mergedPDFBytes = await mergedPDF.save();
    fs.writeFileSync(filePath, mergedPDFBytes);

    // Respond with the path to the saved PDF
    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error('Error merging and saving PDFs:', error);
    res.status(500).json({ message: 'Error merging and saving PDFs' });
  }
}

module.exports = {
  mergePDFs,
};


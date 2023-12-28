const express = require("express");
const multer = require('multer');
const {authorize} = require('../middlewares/auth.js');
const {mergePDFs, sortPdf, getPdfNames} = require('../controllers/fileController.js');
const router = express.Router();
// Set up Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });


router.route("/api/upload/:platform").post(upload.array('pdfFiles',20),authorize,mergePDFs);
router.route("/api/process-pdf/:platform/:pdfName").get(authorize,sortPdf);
router.route("/api/processedPdfNames").get(authorize,getPdfNames);


module.exports = router;
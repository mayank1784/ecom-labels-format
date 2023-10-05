const express = require("express");
const multer = require('multer');
const {authorize} = require('../middlewares/auth.js');
const {mergePDFs} = require('../controllers/fileController.js');
const router = express.Router();
// Set up Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });


router.route("/api/upload").post(upload.array('pdfFiles',20),authorize,mergePDFs);

module.exports = router;
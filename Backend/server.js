const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const cookieParser = require("cookie-parser");
const { deleteFilesOlderThan: cleanupFolder1 } = require('./utils/cleanupFolder1');
const { deleteFilesOlderThan: cleanupFolder2 } = require('./utils/cleanupFolder2');


const login = require('./routes/loginRoute.js');
const fileRoute = require('./routes/fileRoute.js');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/pdf_arranger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


app.use(cookieParser());
// Routes
app.use("/",login);
app.use("/",fileRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Set up intervals for cleaning up folders
const folder1Path = path.join(__dirname,'public','uploads'); //path to uploads folder
const folder2Path = path.join(__dirname,'public','output'); //path to output folder
const cleanupInterval1 = 30 * 60 * 1000; // 30 minutes in milliseconds for the uploads folder
const cleanupInterval2 = 5 * 60 * 1000; // 5 minutes in milliseconds for the output folder

// Initial cleanup when starting the app
cleanupFolder1(folder1Path, cleanupInterval1);
cleanupFolder2(folder2Path, cleanupInterval2);

// Set up intervals for ongoing cleanup
setInterval(() => {
  cleanupFolder1(folder1Path, cleanupInterval1);
}, cleanupInterval1);

setInterval(() => {
  cleanupFolder2(folder2Path, cleanupInterval2);
}, cleanupInterval2);

console.log(`File cleanup script for ${folder1Path} started. Deleting files older than ${cleanupInterval1 / (60 * 1000)} minutes.`);
console.log(`File cleanup script for ${folder2Path} started. Deleting files older than ${cleanupInterval2 / (60 * 1000)} minutes.`);
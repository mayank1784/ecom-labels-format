const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const cookieParser = require("cookie-parser");
// const authorize = require("./middlewares/auth.js");
const login = require('./routes/loginRoute.js');
const fileRoute = require('./routes/fileRoute.js');
// const { loginWithFirebase } = require('./controllers/authController');
const app = express();

// // Firebase configuration
// // Initialize Firebase Admin SDK with your service account key
// const serviceAccount = require('./your-service-account-key.json'); // Replace with your actual service account key
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   // Your other Firebase Admin SDK configuration options
// });

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
// app.use(authorize);

app.use(cookieParser());
// Routes
app.use("/",login);
app.use("/",fileRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

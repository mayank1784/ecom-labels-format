const express = require("express");
const {loginUser, getUser} = require("../controllers/userController.js"); 
const {authorize} = require('../middlewares/auth.js');

const router = express.Router();

router.route("/api/google-login").post(loginUser);
router.route('/api/getUser').get(authorize, getUser);

module.exports = router;
const express = require("express");
const {authorize} = require('../middlewares/auth.js');
const {test1} = require('../controllers/authTestController.js');
const router = express.Router();

router.route("/api/features").get(authorize,test1);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getBuyers } = require("../controllers/buyer.controller");
const verifyToken = require("../middleware/auth.middleware");

router.get("/", verifyToken, getBuyers);

module.exports = router;
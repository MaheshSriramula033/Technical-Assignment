const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/upload.controller");

router.post("/", auth, upload.single("file"), controller.uploadBuyers);

module.exports = router;
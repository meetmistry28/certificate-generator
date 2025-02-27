const express = require("express");

const router = express.Router();

const certificateRoutes = require("./certificateRoutes");

router.use("/certificates", certificateRoutes);

module.exports = router;
const express = require("express");
const { ServiceController } = require("../../../controller");

const router = express.Router();

router.post(
    "/generateService", 
    ServiceController.createService
);

router.get(
    "/download/:serviceId", 
    ServiceController.downloadService
);

module.exports = router;
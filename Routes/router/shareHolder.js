var express = require("express");
var router = express.Router();
const controller = require("../../Controllers/index");
const authorize = require("../../validators/authorize");

const fs = require("fs");

router.get(
  "/dashBoard/",
  authorize.validateToken,
  authorize.checkUserPermission,
  controller.shareHolderController.getShareHolderDashbord
);

router.post("/migration", controller.shareHolderController.migrateData);
router.post("/createUser", controller.shareHolderController.createUser);

router.post("/addPayment", controller.paymentController.addPaymentHistory);

module.exports = router;

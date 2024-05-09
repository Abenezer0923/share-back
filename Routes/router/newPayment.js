var express = require("express")
var router = express.Router();
const controller = require("../../Controllers/index");
const authorize = require("../../validators/authorize");

router.post("/newBankPayment", 
  controller.newPaymentController.uploadImage,
  authorize.validateToken,
  controller.newPaymentController.addPaymentHistory,
  
);

module.exports = router;

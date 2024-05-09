var express = require("express")
var router = express.Router();
const controller = require("../../Controllers/index");
const authorize = require("../../validators/authorize");

router.post("/bankPayment", 
  controller.paymentController.uploadImage,
  authorize.validateToken,// Ensure uploadImage middleware comes first
  controller.paymentController.addPaymentHistory,
  
);


module.exports = router;


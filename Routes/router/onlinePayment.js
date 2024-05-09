var express = require("express")
var router = express.Router();
const controller = require("../../Controllers/index");
const authorize = require("../../validators/authorize");


router.post("/onlinePayment",
authorize.validateToken,
controller.onlinePayment.addOnlinePayment,
);

module.exports = router;
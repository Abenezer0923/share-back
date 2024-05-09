const express = require("express");
const router = express.Router();

const shareHolder_route = require("./router/shareHolder");
const adminShareholder=require("./router/adminRoute");
// const validateToken=require('../middleware/validateTokenHandler');
const newPayment = require("./router/newPayment");
const onlinePayment = require("./router/onlinePayment");
const auth_route = require("./router/auth");
const upload_route = require("./router/payment")
const telebirrPay = require('./router/telbirrPayment')

const paymentController = require('../Controllers/payment.controller')


// Admin Dashboard Routes
router.use("/admin/dashboard",adminShareholder);


router.use("/shareHolder", shareHolder_route);
router.use("/auth", auth_route);
router.use("/banktransfer", onlinePayment);
router.use("/newPayment", newPayment);
router.use("/orderPayment", upload_route);
router.use("/payment/telebirr/pay", paymentController.telebirr_pay);
router.use("/payment/arifpay/pay", paymentController.arifPay_pay);
router.use("/payment/arifpay/callback", paymentController.arifpay_callback);
router.use("/payment/telebirr/home", paymentController.home);



module.exports = router;


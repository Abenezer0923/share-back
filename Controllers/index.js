const shareHolderController = require("./Controller/ShareHolders/shareHoldersController");
const authController = require("./Controller/Auth/authController");
const paymentController = require("./Controller/Payments/bankTransferController")
const newPaymentController = require("./Controller/Payments/newBankTransferController");
const onlinePayment = require('./Controller/Payments/onlineBankTransferController')
const telebirrPayment = require("./Controller/Payments/teleBirrController")
module.exports = {
  authController,
  shareHolderController,
  paymentController,
  newPaymentController,
  telebirrPayment,
  onlinePayment
};

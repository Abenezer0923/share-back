const PaymentOrder = require("../../../Models/Payment/paymentOrderModel");
const newPaymentOrder = require("../../../Models/Payment/newPaymentOrderModel");
const Payment = require("../../../Models/Payment/paymentModel");
const ShareHolder = require('../../../Models/ShareHolders/shareHoldersModel');
const PaymentHistory = require("../../../Models/Payment/paymentHistoryModel");
const getuser = require("../../../validators/authorize.js").getUser;
const path = require("path");


const multer = require('multer');


// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('image'); // 'image' should match the name attribute in the frontend input element

// Function to handle image upload
const uploadImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      
      return res.status(500).json({ error: err.message });
    }
    
    next();
  });
};

// Function to add payment history
const addPaymentHistory = (req, res) => {
  // Retrieve necessary data from request body
  const { shareCatagory,acc_No, percentage, amount, paymentMethod, amount_birr, shareHolder_id, paymentStatus } = req.body;

  // Create a new payment history object
  const newPaymentHistory = new newPaymentOrder({
    acc_No:acc_No,
    paidAmount: amount,
    percentage: percentage,
    amount_birr: amount_birr,
    paymentMethod: paymentMethod,
    shareHolder: shareHolder_id,
    paymentStatus:paymentStatus,
    shareCatagory: shareCatagory,

    // Add other fields as necessary
    image: req.file.path || null // Path to the uploaded image file
  });

  // Save the new payment history record to the database
  newPaymentHistory.save()
    .then(savedPaymentHistory => {
      res.status(201).json(savedPaymentHistory); // Respond with the saved payment history object
    })
    .catch(error => {
      res.status(500).json({ error: error.message }); // Handle database save error
    });
};

module.exports = {
  uploadImage,
  addPaymentHistory
};

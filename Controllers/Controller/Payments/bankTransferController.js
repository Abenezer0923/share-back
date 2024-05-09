const PaymentOrder = require("../../../Models/Payment/paymentOrderModel");
const Payment = require("../../../Models/Payment/paymentModel");
const ShareHolder = require('../../../Models/ShareHolders/shareHoldersModel');
const PaymentHistory = require("../../../Models/Payment/paymentHistoryModel");
const getuser = require("../../../validators/authorize.js").getUser;
const path = require("path");


const multer = require('multer');

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dfpupkulr',
  api_key: '942434959977872',
  api_secret: 'vcTEdx6KnC4nbtFLpIzfHR-yeqY'
});


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
  upload(req, res, async function (err) {
    
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      
      return res.status(500).json({ error: err.message });
    }
    console.log(req.file.path)
    try {
      const filePath = req.file.path;
      const folder = "shareholder/bank_reciept";
      const result = await cloudinary.uploader.upload(filePath, { folder: folder, quality: 70, });
      
      console.log({ result });

      req.cloudinary_secure_url = result ? result.secure_url : '';
      
      next();
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
    }
  });
};

// Function to add payment history
const addPaymentHistory = (req, res) => {
  // Retrieve necessary data from request body
  const { shareCatagory,acc_No, percentage, amount, paymentMethod, payment_id, amount_birr, shareHolder_id, paymentStatus } = req.body;
  console.log("hey this is amount birr", amount_birr);
  console.log({url:req.cloudinary_secure_url})
  // Create a new payment history object
  const newPaymentHistory = new PaymentOrder({
    acc_No:acc_No,
    paidAmount: amount,
    percentage: percentage,
    amount: amount_birr,
    payment: payment_id, //payment_id is the ObjectId of the related payment record
    paymentMethod: paymentMethod,
    shareHolder: shareHolder_id,
    paymentStatus:paymentStatus,
    shareCatagory: shareCatagory,

    // Add other fields as necessary
    image: req.cloudinary_secure_url || null // Path to the uploaded image file
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

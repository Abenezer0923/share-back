// const shareHolder = require("../../../Models/ShareHolders/shareHoldersModel");
const shareInfo = require("../../../Models/ShareHolders/shareInfoModel");
const userModel = require("../../../Models/Auth/userModel");
const paymentModel = require("../../../Models/Payment/paymentModel");
const paymentHistoryModel = require("../../../Models/Payment/paymentHistoryModel");
const Certificates = require("../../../Models/Certificates/ordinaryShareModel");
const shareHoldersModel = require("../../../Models/ShareHolders/shareHoldersModel");
const shareInfoModel = require("../../../Models/ShareHolders/shareInfoModel");
const getuser = require("../../../validators/authorize.js").getUser;
const passgen = require("generate-password");
const PaymentOrder = require("../../../Models/Payment/paymentOrderModel")
const newPaymentOrder = require("../../../Models/Payment/newPaymentOrderModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const hbs = require("handlebars");
const path = require("path");
const fs = require("fs");
const PB_email = process.env.SENDER_GMAIL_ADDRESS;
const pass = process.env.SENDER_GMAIL_PASSWORD;

const hashPasword = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return done(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        resolve(hash);
      });
    });
  });
};

const email_info = nodemailer.createTransport({
  host: "mail.purposeblack.et",
  port: 465,
  secure: true,
  auth: {
    user: PB_email,
    pass: pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
  maxMessages: Infinity,
  maxConnections: 20,
});

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

const filePath = path.join(__dirname, "../../../email/index.html");

module.exports = {
  getShareHolders: async (req, res) => {
    shareHolder.find((err, shareHolder) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(200).json(shareHolder);
    });
  },

  gethareHolderById: async (req, res) => {
    let id = req.params.id;
    shareHolder.findOne({ _id: id }, (err, shareHolder) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(200).json(shareHolder);
    });
  },

  getShareHolderDashbord: async (req, res) => {
    var user = getuser(req);

    console.log(user);

    let dash_data = {};
    let payment_historys = [];

    let shareHolder = await shareHoldersModel.findOne({ user: user.userID });

    dash_data.shareHolderInfo = shareHolder;
    let shareInfo = await shareInfoModel.find({
      shareHolder: shareHolder._id,
      paymentCompleted: true,
    });
    
    dash_data.completedShareInfo = shareInfo;
    let paymentOrder = await PaymentOrder.find({
      shareHolder:shareHolder._id,
     })
     dash_data.payment_Order = paymentOrder

    let currentShareInfo = await shareInfoModel.findOne({
      shareHolder: shareHolder._id,
      paymentCompleted: false,
    });

    let newPaymentOrders = await newPaymentOrder.findOne({
      shareHolder: shareHolder._id,

    })
    dash_data.newPayment_Order = newPaymentOrders
    console.log("were is sharre???????????",currentShareInfo);
    dash_data.currentShareInfo = currentShareInfo;
    let shareTotal = await shareInfoModel.aggregate([
      {
        $match: {
          shareHolder: {
            $eq: shareHolder._id,
          },
        },
      },
      {
        $group: {
          _id: "$shareCatagory",
          total: {
            $sum: "$amountSubscribed",
          },
        },
      },
    ]);
    dash_data.shareCatagoryTotal = shareTotal;
    let subtotal = await shareInfoModel.aggregate([
      {
        $match: {
          shareHolder: {
            $eq: shareHolder._id,
          },
        },
      },
      {
        $group: {
          _id: null,
          subtotal: {
            $sum: "$amountSubscribed",
          },
        },
      },
    ]);
    dash_data.subtotal = subtotal[0].subtotal;
    let payment_hy = await paymentModel.find({ shareHolder: shareHolder._id });

    let payment = await paymentModel.find({
      shareHolder: shareHolder._id,
      percentage: "100%",
    });
    console.log(payment);
    dash_data.completedPayment = payment;
    if (currentShareInfo) {
      let currentPayment = await paymentModel.findOne({
        shareInfo: currentShareInfo._id,
      });
      dash_data.currentPayment = currentPayment;
    }

    for (var i = 0; i < payment_hy.length; i++) {
      let payment_history = await paymentHistoryModel.find({
        payment: payment_hy[i]._id,
      });
      for (var j = 0; j < payment_history.length; j++) {
        payment_historys.push(payment_history[j]);
      }
    }

    dash_data.payment_history = payment_historys;

    //console.log(dash_data);
    return res.json({
      success: true,
      data: dash_data,
    });
  },

  migrateData: async (req, res) => {
    let data = req.body;
    let shId = "";
    let count = 1;
    data.forEach(async (user) => {
      let shSaved = null;
      for (let i = 0; i < user.all.length; i++) {
        let sh = user.shareHolderInfo[i];
        // console.log(sh);
        let py = user.all[i].payments[0];
        // console.log(py);
        let pyh = user.all[i].payment_history;

        // console.log(pyh);
        if (i == 0) {
          let newSH = new shareHolder({
            first_name: sh.first_name,
            middle_name: sh.middle_name,
            last_name: sh.last_name,
            address: sh.address,
            house_number: sh.house_number,
            state: sh.state,
            city: sh.city,
            country: sh.country,
            zipCode: sh.zipCode,
            email: sh.email,
            phone: sh.phone,
            createdAt: sh.createdAt.$date,
            updatedAt: sh.createdAt.$date,
          });
          shSaved = await newSH.save();
        }

        let newSHINFO = new shareInfo({
          numberOfShare: sh.amount_of_units,
          amountSubscribed: sh.total_share,
          shareCatagory: "ordinary",
          shareType: "ordinary",
          shareHolder: shSaved._id,
          paymentStarted: true,
          paymentCompleted: sh.payment_complete,
          createdAt: sh.createdAt.$date,
          updatedAt: sh.createdAt.$date,
        });

        let savedSHINFO = await newSHINFO.save();

        let newPyInfo = new paymentModel({
          shareHolder: shSaved._id,
          shareInfo: savedSHINFO._id,
          percentage: py.paid_percentage,
          amountPaid: py.paid_amount_in_etb,
          amountSubscribed: py.pledged_amount,
          createdAt: py.createdAt.$date,
          updatedAt: py.createdAt.$date,
        });

        let savedPyInfo = await newPyInfo.save();
        for (let j = 0; j < pyh.length; j++) {
          let newPyh = new paymentHistoryModel({
            transaction_id: pyh[j].transaction_id,
            transaction_time: pyh[j].transaction_time,
            paidAmount: pyh[j].paid_amount,
            payment: savedPyInfo._id,
            phone_number: pyh[j].phone_number,
            paymentMethod: pyh[j].payment_method,
            bill_ref_number: pyh[j].bill_ref_number,
            status: pyh[j].status,
            manual_receipt_number: "",
            createdAt: pyh[j].createdAt.$date,
            updatedAt: pyh[j].createdAt.$date,
          });

          await newPyh.save();
          console.log(newPyh.bill_ref_number);
        }
      }
      console.log(count++);
    });

    res.send("data is mygrating....");
  },


  createUser: async (req, res) => {
    let email = req.body.email;

    let shareHolder = await shareHoldersModel.findOne({ email: email });
    const password = passgen.generate({
      length: 8,
      numbers: true,
    });
    const hashed_password = await hashPasword(password);
    let user = new userModel({
      email: shareHolder.email,
      phone: shareHolder.phone,
      password: hashed_password,
    });

    let newUser = await user.save();

    shareHolder.user = newUser._id;

    let updatedSH = shareHolder.save();

    if (updatedSH) {
      try {
        readHTMLFile(filePath, function (err, html) {
          const template = hbs.compile(html);
          const replacements = {
            username: shareHolder.email,
            password: password,
            reg_link: process.env.PUBLIC_URL,
          };
          const htmlToSend = template(replacements);
          const email = {
            from: PB_email,
            to: shareHolder.email,
            subject: "PurposeBlack ETH ShareHolder Credentials",
            html: htmlToSend,
            cc: "admin@purposeblack.et",
          };
          email_info.sendMail(email, (error, info) => {
            if (error) {
              console.log(error);
              console.log("email not sent!");
            } else {
              console.log(info);
              return res.status(201).json({
                success: true,
                message: "User Created Successfully!!",
              });
            }
          });
        });
      } catch (error) {
        console.log(error);
        return res.json({
          success: false,
          message: "email not sent",
        });
      }
    }
  },
};

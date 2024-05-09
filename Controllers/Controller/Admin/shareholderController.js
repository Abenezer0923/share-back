const paymentModel = require('../../../Models/Payment/paymentModel');
const shareholderModel=require('../../../Models/ShareHolders/shareHoldersModel');
const paymentHistoryModel=require('../../../Models/Payment/paymentHistoryModel');
const shareInfoModel =require('../../../Models/ShareHolders/shareInfoModel');
const allShareholderData=async(req,res)=>{
    try {
       const result=await shareholderModel.find().sort({_id:-1});
       res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }
} 
const shareholderDetail=async(req,res)=>{
    try {
        const result=await shareholderModel.findById(req.params.id);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
      res.status(500).json(error)
    }
}
// Get shareholder detail Inforrmation
const shareholderDetailInfo = async (req, res) => {
  try {
    const shareholderId = req.params.id;
    const shareHolder=await shareholderModel.findById(shareholderId);
   //  res.status(201).json(shareHolder);
   const payment=await paymentModel.findOne({shareHolder:shareholderId});
   const paymentId=payment._id;
   const shareInfo=await shareInfoModel.findOne({shareHolder:shareholderId});
   const paymentHistory=await paymentHistoryModel.findOne({payment:paymentId});
  
    // const combiendData={
    //    shareHolder:shareHolder,
    //    payment:payment,
    //    shareInfo:shareInfo,
    //    paymentHistory:paymentHistory
    // }
    res.status(201).json(shareHolder);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

// get shareholder Payment Detail
const shareholderPaymentDetail = async (req, res) => {
  // let payment;
  try {
    const shareholderId = req.params.id;
    const shareInfo = await shareInfoModel.find({ shareHolder: shareholderId });
    const payments = [];

    for (let i = 0; i < shareInfo.length; i++) {
        const shareInfoId = shareInfo[i]._id;
        const payment = await paymentModel.find({ shareInfo: shareInfoId });
        payments.push(payment);
    }
    res.status(201).json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}
//get shareholder detail Share Info
const shareholderShareInfo = async (req, res) => {
  try {
    const shareholderId = req.params.id;
    const shareInfo=await shareInfoModel.find({shareHolder:shareholderId});
  
    res.status(201).json(shareInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}
//get shareholder payment History
const shareholderPaymentHistory = async (req, res) => {
  try {
    const shareholderId = req.params.id;
    const shareHolder=await shareholderModel.findById(shareholderId);
   //  res.status(201).json(shareHolder);
   const payment=await paymentModel.findOne({shareHolder:shareholderId});
   const paymentId=payment._id;
   const shareInfo=await shareInfoModel.findOne({shareHolder:shareholderId});
   const paymentHistory=await paymentHistoryModel.find({payment:paymentId});

    res.status(201).json(paymentHistory);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}
const deleteShareholder=async(req,res)=>{
      try {
      const id=req.params.id;
      if(id){
      const shareholder= await shareholderModel.findByIdAndDelete(id);
      console.log(shareholder);
      res.status(200).json(shareholder);
      }
      else{
        console.log("No user to be deleted");
      }
      } catch (error) {
        console.log(error);
      }
}
module.exports={allShareholderData,shareholderDetail,
                shareholderShareInfo,shareholderPaymentDetail,
                shareholderDetailInfo,shareholderPaymentHistory,
                deleteShareholder
                }
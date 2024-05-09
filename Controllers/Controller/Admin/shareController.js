const shareInfoModel =require('../../../Models/ShareHolders/shareInfoModel');
const shareholderModel=require('../../../Models/ShareHolders/shareHoldersModel');
const paymentModel = require('../../../Models/Payment/paymentModel');
const paymentHistoryModel = require('../../../Models/Payment/paymentHistoryModel');


const updateBalanceController= async(req,res)=>{
 try {
    const shareholderId = req.params.id;// Get the document ID from the request parameters
    const { amountPaid,shareCategory} = req.body; // Get the new column value from the request body
    
    const updatedDocument=await paymentModel.findOne({shareHolder:shareholderId});
    const amountPaidToInteger=parseInt(amountPaid);
    const totalBalancePaid=updatedDocument.amountPaid + amountPaidToInteger;
    updatedDocument.amountPaid=totalBalancePaid;
    const percentage = `${(updatedDocument.amountPaid * 100) / updatedDocument.amountSubscribed}%`;
    updatedDocument.percentage = percentage;
    const updateSuccess=await updatedDocument.save();  //update balance 
    console.log(updateSuccess);

    const paymentHistoryId=updateSuccess._id;
    console.log(paymentHistoryId);
    const updatePaymentHistory=new paymentHistoryModel({
      transaction_id :"",
      transaction_time:updateSuccess.createdAt,
      paidAmount:updateSuccess.amountPaid,
      payment:paymentHistoryId,
      phone_number:"",
      paymentMethod:"bank",
      bill_ref_number:"",//from request
      status:"confirmed",
      manual_receipt_issued:false, 
      manual_receipt_number:" " 
    })
    const updatedSuccessPaymentHistory = await updatePaymentHistory.save();
    console.log(updatedSuccessPaymentHistory);
  
    // update percentage
    // const updatePercentage=await paymentModel.findByIdAndUpdate({shareHolder:shareholderId});
    // updatedDocument.percentage=(updatePercentage.amountPaid * 100)/updatePercentage.amountSubscribed ;
    // updatePercentage.save();
    // console.log(updatePercentage);

       
 } catch (error) {
   console.log(error);
   res.status(500).json(error);
 }
}

// perecentage is updated no added like balance
// const updatePercentageController= async(req,res)=>{
//     const shareholderId = req.params.id;// Get the document ID from the request parameters
//    const { amountPaid,shareCategory} = req.body; // Get the new column value from the request body
//    console.log(shareCategory);
//    const ShareholderData=await shareholderModel.findById(shareholderId);
//    const shareInfo=await shareInfoModel.findOne({shareHolder:shareholderId});
//    console.log(ShareholderData);
//    const totalBalancePaid=amountPaid + shareInfo.amountSubscribed;
//    console.log(totalBalancePaid);
 
//    try {
//      const updatedDocument = await shareInfoModel.findByIdAndUpdate(
//        shareholderId,
//        { amountSubscribed: totalBalancePaid }, // Replace 'columnName' with the actual name of the column to update
//        { new: true }
//      );
//      res.status(200).json(updatedDocument);
//    } catch (error) {
//      console.error(error);
//      res.status(500).json({ message: 'Server Error' });
//    }
//  }
module.exports={updateBalanceController}
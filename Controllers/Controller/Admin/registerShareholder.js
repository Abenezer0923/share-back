const paymentHistoryModel = require('../../../Models/Payment/paymentHistoryModel');
const paymentModel = require('../../../Models/Payment/paymentModel');
const shareholderModel=require('../../../Models/ShareHolders/shareHoldersModel');
const shareInfoModel = require('../../../Models/ShareHolders/shareInfoModel');

const registerShareholder=async(req,res)=>{
   try {
    const { 
         first_name,middle_name,last_name,
         address,house_number,state,city,
         country,zipCode,email,phone
           }=req.body;
    const {
            shareCatagory,
            numberOfShare,
            amountSubscribed,
            paymentCompleted
         }=req.body;
    const { 
            percentage,
            amountPaid,
            } =req.body;
    const image = req.file.filename; // Get the filename of the uploaded image
     
    // save in shareholder Model
    const newShareholder=new shareholderModel({
       first_name,
       middle_name,
       last_name,
       address,
       house_number,
       state,
       city,
       country,
       zipCode,
       email,
       phone,
       image,
    });
    const savedShareholder= await newShareholder.save();
    
    const shareType="oridinary";
    const paymentStarted=true;
    // const paymentCompleted=true;
    const shareHolder =savedShareholder._id;
    console.log(savedShareholder._id);

    // save into share info models
    const newShareInfo=new shareInfoModel({
        shareCatagory,
        numberOfShare,
        amountSubscribed,
        shareType,
        shareHolder,
        paymentStarted,
        paymentCompleted
    })
    const savedShareInfo=await newShareInfo.save();
    const shareInfo=savedShareInfo._id;

    // save into payment model
    const newPayment=new paymentModel({
            shareHolder,
            shareInfo,
            percentage,
            amountPaid,
            amountSubscribed
    })
    const savedPayment= await newPayment.save();
    if(savedPayment){
        console.log("payment info saved successfully");
    }
    if(savedShareInfo){
        res.status(201).status("share info saved correcttly");
    }
    
    const {bill_ref_number}=req.body;

     const transaction_id="adm123456789";
     const transaction_time=savedShareholder.createdAt;
     const status="confirmied";
     const phone_number=savedShareholder.phone;
     const payment=savedPayment._id;
     const paidAmount=savedPayment.amountPaid;
    const newPaymentHistory= new paymentHistoryModel({
        transaction_id,
        transaction_time,
        paidAmount,
        payment,
        phone_number,
        paymentMethod:"bank",
        bill_ref_number,//from request
        status,
        manual_receipt_issued:false, 
        manual_receipt_number:" " //given by finance
    });
    const savedPaymentHistory= await newPaymentHistory.save();
    if(savedPaymentHistory){
        console.log("history registered successfully");
    }

   if(savedShareholder && savedShareInfo && savedPayment){
     res.status(201).json({message:"Successfully saved"});
   }
   else{
    res.status(201).json({message:"Successfully saved"});
   }
   } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
   }

}
module.exports={registerShareholder}
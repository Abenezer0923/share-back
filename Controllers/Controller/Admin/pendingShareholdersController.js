const paymentHistoryModel = require('../../../Models/Payment/paymentHistoryModel');
const paymentModel = require('../../../Models/Payment/paymentModel');
const pendingModel=require('../../../Models/ShareHolders/penddingUserModel');
const shareHoldersModel = require('../../../Models/ShareHolders/shareHoldersModel');
const shareInfoModel = require('../../../Models/ShareHolders/shareInfoModel');


const allPendingUserData=async(req,res)=>{
    try {
       const result=await pendingModel.find().sort({_id:-1});
       res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({message:error.message})
    }
}
const pendingUserDetail= async(req,res)=>{
       try {
        const id= req.params.id
        const result =await pendingModel.findById(id);
        res.status(201).json(result);
        console.log(result);
       } catch (error) {
        console.log(error);
        res.status(500).json(error);
       }
}

const pendingUserSaveInToShareholder=async(req,res)=>{
    try {
       const id=req.params.id;
       const result=await pendingModel.findById(id);
      //  res.status(201).json(result.first_name);
      //  console.log(result);
      const saveInToShareholder=new shareHoldersModel({
           first_name:result.first_name,
           middle_name:result.middle_name,
           last_name:result.last_name,
           address: result.address,
            house_number: result.house_number,
            state: result.state,
            city: result.city,
            country: result.country,
            zipCode: result.zipCode,
            email: result.email,
            phone: result.phoneNumber,
            image:result.image
      });
      const shareholder= await saveInToShareholder.save();
      // res.status(201).json({message:"successfully saved into shareholder"});
    // save into Share Info
    let pComplated;
    if(result.amountPaid >=result.amountSubscribed){
        pComplated=true
    }
    else{
      pComplated=false
    }


      const saveInToSahreInfo= new shareInfoModel({
        numberOfShare: result.numberOfShare,
        amountSubscribed: result.amountSubscribed,
        shareCatagory: result.shareCatagory,
        shareType: result.shareType,
        shareHolder: shareholder._id,
        paymentStarted:true,
        paymentCompleted:pComplated,

      })
      const shareInfo= await saveInToSahreInfo.save();
      // res.status(201).json({message:"share info saved Successfully"});

    // save into payment
      const saveInToPayment=new paymentModel({
        shareHolder:shareholder._id,
        shareInfo: shareInfo._id,
        percentage:(result.amountPaid *100)/result.amountSubscribed + "%",
        amountPaid: result.amountPaid,
        amountSubscribed: result.amountSubscribed,
   });
   const payment= await saveInToPayment.save();
  //  res.status(201).json({message:"successfully saved into payment"});

  //  save into paymentHistory
      const saveInToPaymentHistory=new paymentHistoryModel({
        transaction_id: "",
        transaction_time: result.createdAt,
        paidAmount: result.amountPaid,
        payment:payment._id,
        // paymentOrder
        phone_number: result.phoneNumber,
        paymentMethod: result.paymentMethod,
        bill_ref_number: result.bill_ref_number,
        status: "active",
        manual_receipt_issued:false,
        manual_receipt_number:""
   });
   const paymentHistory= await saveInToPaymentHistory.save();

   const deltePendingUser= await pendingModel.findByIdAndDelete(id);
   res.status(201).json({message:" recored successfully saved into shareholder and deleted from pending"});

    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    
  }
}


module.exports={allPendingUserData,pendingUserDetail,
                pendingUserSaveInToShareholder}
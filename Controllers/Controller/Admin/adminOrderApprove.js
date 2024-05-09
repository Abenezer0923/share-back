const paymentOrderModel=require('../../../Models/Payment/paymentOrderModel');
const paymentHistoryModel=require('../../../Models/Payment/paymentHistoryModel');
const paymentModel=require('../../../Models/Payment/paymentModel');
const shareInfoModel = require('../../../Models/ShareHolders/shareInfoModel');
const shareHoldersModel = require('../../../Models/ShareHolders/shareHoldersModel');

const paymentOrderApproval=async(req,res)=>{
    try {
        const id=req.params.id;
       if(id){
        const paymentOrder= await paymentOrderModel.findById(id);//get payment Orders data based on params id
        console.log(paymentOrder);
        const paymentId=paymentOrder.payment;
        if(paymentId){
            //if some one have payment id not add new type of share
            //only add balance and payment history
            const getPayment = await paymentModel.findOne({_id:paymentId,
                $or: [
                    { amountPaid:paymentOrder.amountSubscribed},
                    { percentage: { $lt: "100%"  } }
                  ]    
                   });
        //    const getPayment=await paymentModel.findOne(paymentId,amountPaid*100<amountSubscribed);
           const shareInfoId=getPayment.shareInfo;// share info Id
           const getShare=await shareInfoModel.findOne(shareInfoId);//get share based on payment id
           // update payment models    
           const updatedAmount=parseInt(paymentOrder.amount) + parseInt(getPayment.amountPaid);  
           const pp=(updatedAmount *100)/getShare.amountSubscribed;
           const updatedPercentage=pp+"%";
           if(getPayment.amountPaid <= getShare.numberOfShare * 100 ||
               getPayment.percentage <="100%"){
               const updateData = {
                   percentage: updatedPercentage,
                   amountPaid: updatedAmount ,
                 };     
               const updatedPayment = await paymentModel.findByIdAndUpdate(paymentId, 
                   updateData, { new: true });
                   // console.log(updatedPayment);
           }//end if
           else{
               console.log("you have been complated the share amount");
           }
           
          //  save into paymentHistory
          const saveInToPaymentHistory= new paymentHistoryModel({
            transaction_id: "",
            transaction_time: paymentOrder.createdAt,
            paidAmount: paymentOrder.amount,
            payment:paymentOrder.payment,
            paymentOrder:paymentOrder._id,
            phone_number: paymentOrder.phoneNumber,
            paymentMethod: paymentOrder.paymentMethod,
            bill_ref_number: paymentOrder.bill_ref_number,
            status: "active",
            manual_receipt_issued:false,
            manual_receipt_number:""
       });
       const paymentHistory= await saveInToPaymentHistory.save();
       console.log(paymentHistory);
    //    const deleteApprovedOrder= await paymentOrderModel.findByIdAndDelete(id);
        res.status(201).json({message:" recored successfully saved into payment history model \n \tand deleted payment order model"});
           // res.status(201).json(paymentHistory);
               
              }  
              else{
                let paymentCompleted;
                const paymentStatus=paymentOrder.numberOfShare *100 >=paymentOrder.amountSubscribed;
                if(paymentStatus){
                    paymentCompleted=true;
                }
                else{
                    paymentCompleted=false;
                }
                const shareInfo=new shareInfoModel({
                    numberOfShare: paymentOrder.numberOfShare,
                    amountSubscribed:paymentOrder.amountSubscribed ,
                    shareCatagory: paymentOrder.shareCatagory,
                    shareType:paymentOrder.shareType ,
                    shareHolder:paymentOrder.shareHolder,
                    paymentStarted:"true", 
                    paymentCompleted
                });
                const savedShareInfo=await shareInfo.save();

                const paymentt=new paymentModel({
                      shareHolder:savedShareInfo.shareHolder,
                      shareInfo:savedShareInfo._id,
                      percentage:paymentOrder.amount,
                      amountPaid:(paymentOrder.amount *100)/paymentOrder.amountSubscribed,
                      amountSubscribed:paymentOrder.amountSubscribed,
                })
                const savedPaymentt=await paymentt.save();

                const saveInToPaymentHistory= new paymentHistoryModel({
                    transaction_id: "",
                    transaction_time: paymentOrder.createdAt,
                    paidAmount: paymentOrder.amount,
                    payment:savedPaymentt._id,
                    paymentOrder:paymentOrder._id,
                    phone_number: paymentOrder.phoneNumber,
                    paymentMethod: paymentOrder.paymentMethod,
                    bill_ref_number: paymentOrder.bill_ref_number,
                    status: "active",
                    manual_receipt_issued:false,
                    manual_receipt_number:""
               });
               const paymentHistory= await saveInToPaymentHistory.save();
               res.status(201).json({message:"successfully approved new order"});
              }
     
       }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
       
}
const getPaymentOrderData=async(req,res)=>{
    try {
        const data= await shareHoldersModel.find();//get all shareholder
        const shId=data[0]._id;
        const paymentOrder=await paymentOrderModel.find({shareHolder:shId});//get payment order data based on shareholder
        console.log(paymentOrder);
        // const shareInfoId=paymentOrder[0].shareInfo;
        // const shareInfoData=await shareInfoModel.find(shareInfoId);//get share info based on payment order
        // const shareholderId=shareInfoData[0].shareHolder;
        // const shareholderData= await shareHoldersModel.find(shareholderId);//get shareholder based on sahareinfo data 
        // res.status(201).json({shareInfoData:shareInfoData,shareholderData:shareholderData});
        res.status(201).json(paymentOrder);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
    }
}
const detailInfoOfPaymentOrder=async(req,res)=>{
   try {
    const id=req.params.id;
    if(id){
     const paymentOrder= await paymentOrderModel.findById(id);//get payment Orders data based on params id
    //  console.log(paymentOrder);
    const shareholderId=paymentOrder.shareHolder;
    const shareholderData=await shareHoldersModel.findOne({_id:shareholderId});
     res.status(201).json({paymentOrder:paymentOrder,shareholder:shareholderData});
    }
   } catch (error) {
    console.log(error);
    res.status(500).json(error.message)
   }
}

module.exports={paymentOrderApproval,getPaymentOrderData,detailInfoOfPaymentOrder}
const xlsx = require('xlsx');


// Define your mongoose models
      const paymentModel = require('../../../Models/Payment/paymentModel');
      const shareholderModel=require('../../../Models/ShareHolders/shareHoldersModel');
      const paymentHistoryModel=require('../../../Models/Payment/paymentHistoryModel');
      const shareInfoModel =require('../../../Models/ShareHolders/shareInfoModel');


      // Payment
      const payment = async(req,res) =>{
        const shares = await shareInfoModel.find();

        // console.log({shares})

        // return res.status(200).json({yyy:true})
        const workbook1 = xlsx.readFile('file/zz.xlsx');

        for (const share of  shares){
          
          const sheetNames = ['payment'];
            
          const jsonData = sheetNames.map((sheetName) => {
            const worksheet = workbook1.Sheets[sheetName];
            return xlsx.utils.sheet_to_json(worksheet);
          });

          const payments = jsonData[0];
          // console.log(payments);
          // let sid;
          const payment = payments.filter(py =>{
            // sid=py['SID(FK)'];
            if(py.SID == share.ID){
              return py;
            }
          })

          if(payment.length>0){
            for(const pay of payment){
              const unPaidBalance=pay['Un-paid Balance'];
              const paidBalance=pay['Amount\n Paid in Cash'];
              const amountSubscribed= unPaidBalance + paidBalance;
              const percentageInNumber=(paidBalance *100)/amountSubscribed;
              const percentage=percentageInNumber + "%";
              // console.log(pay);
              const data = {
                SID:pay.SID,
                shareholderId:pay['sholderiD(FK)'],//from xl
                amountPaid:pay['Amount\n Paid in Cash'],
                amountSubscribed,
                percentage,
                typeOfData:"payment_from_xl",
                shareInfo:share._id,
                shareHolder:share.shareHolder
              }
               const savedPaymentModel = await paymentModel.create(data);
              console.log({savedPaymentModel});
            }
          }
        }
        return res.status(200).json({finished:true})
      }

      const missingShares = async(req,res) =>{
        const workbook1 = xlsx.readFile('file/zz.xlsx');

        const sheetNames = ['share'];
            
        const jsonData = sheetNames.map((sheetName) => {
          const worksheet = workbook1.Sheets[sheetName];
          return xlsx.utils.sheet_to_json(worksheet);
        });

        const shares = jsonData[0];

        for(const share of shares){
          const dbshare = await shareInfoModel.findOne({ID:share.ID}) 
          if(dbshare){
            // console.log({passed:true})
          }else{
            const holder = await shareholderModel.findOne({ID:share.FID})
            if(holder){
              const data = {
                ID:share.ID,
                FID:share.FID,
                shareType:share['share type'],
                numberOfShare:share['No of \r\nShares'],
                amountSubscribed:share['Amount \r\nSubscribed'],
                shareHolder:holder._id
              }

              const savedshareInfoModel = await shareInfoModel.create(data)
              console.log({savedshareInfoModel})
            }else{
              console.log({holderNotFound:share})
            }
          }
          
          // return res.status(200).json({dbshare})
        }

        return res.status(200).json({finished:true})
      }


      // Convert and save
      const convertToJson = async (req, res) => {
        try {
          // Read the XLSX file
          const shareholds = await shareholderModel.find();
          // console.log({shareholds, len:shareholds.length})
          // return res.status(200).json( {shareholds})

          const workbook1 = xlsx.readFile('file/zz.xlsx');
          
          for (const sharehold of  shareholds){
            // return res.status(200).json( {sharehold})
            const sheetNames = ['share'];
            
            const jsonData = sheetNames.map((sheetName) => {
              const worksheet = workbook1.Sheets[sheetName];
              return xlsx.utils.sheet_to_json(worksheet);
            });

            const shares = jsonData[0];
            // return res.status(200).json( {jsonData})
            let FID;
            const share = shares.filter(sh =>{
               FID=sh['f(id)'];
              if(FID==sharehold.ID){
                return sh;
              }
              // else if(sh.FID=="000"+sharehold.ID){
              //   return sh;
              // }else if(sh.FID=="00"+sharehold.ID){
              //   return sh;
              // }else if(sh.FID=="0"+sharehold.ID){
              //   return sh;
              // }else if(sh.FID==sharehold.ID){
              //   return sh;
              // }
            } )

            if(share.length>0){
              for(const shar of share){
                const shareType=shar['share type'];
                if(shareType=="ordinary" ||shareType=="Agriculture"||shareType=="Agro-processing"){
                shareCatagory="ordinary";
                }else if(shareType=="TSM"){
                  shareCatagory="TSM";
                }
                else{
                  shareCatagory="franchize"
                }

                const paymentStarted=true;
                let paymentCompleted;
                const typeOfData="from_xl";
                const numberOfShare=shar['No of \nShares'];
                const amountSubscribed=shar['Amount \nSubscribed'];
                paymentCompleted=true;
                const data = {
                  ID:shar.SID,
                  FID:shar.FID,
                  paymentStarted,
                  paymentCompleted,
                  shareType,
                  numberOfShare,
                  amountSubscribed,
                  typeOfData,
                  shareHolder:sharehold._id
                }

                const savedshareInfoModel = await shareInfoModel.create(data)
                console.log({savedshareInfoModel})
                // console.log({data})
                // return res.status(200).json( {data})
                // console.log({dd:shar['No of \r\nShares']})
              }
              // return res.status(200).json( {share})
            }
          }

          return res.status(201).json({created:true})

          const workbook = xlsx.readFile('file/zz.xlsx');
      
          // Define the sheet names
          const sheetNames = ['shareholder', 'share', 'payment'];
      
          // Convert each sheet to JSON
          const jsonData = sheetNames.map((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            return xlsx.utils.sheet_to_json(worksheet);
          });
      
          // Combine the data based on the sample ID
          const mergedData = jsonData[0].map((item, index) => {
            const sampleId = item.FID;
            const combinedItem = {
              sampleId,
              ...item,
              ...jsonData[1][index],
              ...jsonData[2][index],
            };
            return combinedItem;
          });
      
          // Save the merged data to the respective models
          const promises = mergedData.map(async (item) => {
            const {
              ID,
              phone,
              'Full Name': fullName,
              Address: address,
              FID,
              'share type': shareCatagory,
              'No of \r\nShares': numberOfShare,
              'Amount \r\nSubscribed': amountSubscribed,
              pid,
              'ID(sid)': sid,
              'Amount\r\n Paid in Cash': amountPaid,
            } = item;
      
            const fullNameParts = fullName.split(' ');
            const first_name = fullNameParts[0];
            const middle_name = fullNameParts[1];
            const last_name = fullNameParts[2];
      
            const model1Data = [
              {
                ID,
                phone,
                first_name,
                middle_name,
                last_name,
                address,
              },
            ]; // Adjust for Model1 requirements
            const percentageInNumber=(100 * amountPaid)/amountSubscribed;
            const percentage=(100 * amountPaid)/amountSubscribed +"%";

            const sheet2Data = [{
               amountPaid,amountSubscribed,percentage,sid,
            }];
            const transaction_id="exported_from_xlsx_1234";
            const paymentMethod="Bank";
            const sheet3Data=[{
              transaction_id,
              amountPaid,
              paymentMethod,
            }];

            let paymentCompleted;
            let paymentStarted;
            if(percentageInNumber===100){
               paymentCompleted=true;
            }
            else{
               paymentCompleted=false;
            }
            if(percentageInNumber >=25){
              paymentStarted=true;
           }
           else{
              paymentStarted=false;
           }
            const sheet4Data=[{
               shareCatagory,
               numberOfShare,
               amountSubscribed,
               paymentCompleted,
               paymentStarted,
               FID,
            }]
      
            // const savedShareholders = await shareholderModel.create(model1Data);
           
            const shareholderIds = savedShareholders.map((shareholder) => shareholder._id);
      
            // Update sheet2Data with the shareholderIds
            const updatedSheet2Data = sheet2Data.map((data, index) => ({
              ...data,
              shareHolder: shareholderIds[index % shareholderIds.length], // Loop through the shareholderIds
            }));
      
            // Save updatedSheet2Data in Model2
            const savedPayment = await paymentModel.create(updatedSheet2Data);
            const paymentIds=savedPayment.map((payment)=>payment._id);
            const updatedSheet3Data = sheet3Data.map((data, index) => ({
              ...data,
              payment: paymentIds[index % paymentIds.length], // Loop through the shareholderIds
            }));
            const savedPaymentHistory=await paymentHistoryModel.create(updatedSheet3Data);
      

            const updatedSheet4Data = sheet4Data.map((data, index) => ({
              ...data,
              shareHolder: shareholderIds[index % shareholderIds.length], // Loop through the shareholderIds
            }));
            const savedShareInfo=await shareInfoModel.create(updatedSheet4Data);
            console.log(savedShareholders);

      
            return [savedShareholders, savedPayment,savedPaymentHistory,savedShareInfo];
          });
      
          // Wait for all saving operations to complete
          await Promise.all(promises);
          res.status(201).json({message:"migrated complate"});
          console.log('Data saved to the models successfully');
        } catch (error) {
          console.error('Error saving data to the models:', error);
        }
      };


const processData=async(req,res)=>{
    
  const XLSX = require('xlsx');
  const pendingModel=require('../../../Models/ShareHolders/penddingUserModel');
  
  // Read the XLSX file
  const workbook = XLSX.readFile('file/zz.xlsx');
  
  // Define the sheet names
  const sheetNames = ['shareholder'];
  
  // Convert each sheet to JSON
  const jsonData = sheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  });
  // Combine the data based on the sample ID
  const mergedData = jsonData[0].map((item, index) => {
    const sampleId = item.FID;
    const combinedItem = {
      sampleId,
      ...item
    };
    return combinedItem;
  });
   console.log(mergedData);
  // Save the merged data to the respective models
  const promises = mergedData.map((item) => {
    const {'ShId(pk)':ID, phone, 'Full Name': fullName,
    Address:address,'ሙሉ ስም':amharicName } = item;
  //  console.log(promises);
    const fullNameParts = fullName.split(' ');
    const first_name = fullNameParts[0];
    const middle_name = fullNameParts[1];
    const last_name = fullNameParts[2];

    // const amharicFullNameParts = amharicName.split(' ');
    // const amharicFName = amharicFullNameParts[0];
    // const amharicMName = amharicFullNameParts[1];
    // const amharicLName = amharicFullNameParts[2];

    const model1Data = {ID,phone,first_name,middle_name,last_name,address,
      amharicName}; // Adjust for Model1 requiremen
    // console.log(amountPaid);
    const promises = [
      shareholderModel.create(model1Data),
    ];

    return Promise.all(promises);
  });
  
  // Wait for all saving operations to complete
  Promise.all(promises)
    .then(() => {
      console.log('Data saved to the models successfully');
    })
    .catch((error) => {
      console.error('Error saving data to the models:', error);
    });
    
}
module.exports={convertToJson,processData,missingShares,payment};
const shareholderModel=require('../../../Models/ShareHolders/shareHoldersModel');
const paymentModel=require('../../../Models/Payment/paymentModel');
const shareInfo=require('../../../Models/ShareHolders/shareInfoModel');
// get all shareholders
const allShareholders = async (req, res) => {
    try {
      const count = await shareholderModel.countDocuments();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error counting data' });
    }
  };

  //get the latest 7 days report of shareholders
  const getLatest7DaysReportOfShareholders=async(req,res) =>{
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const result = await shareholderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {$count: "shareholdersWeekly" }
      ]);
  
      res.json(result[0].shareholdersWeekly);
      // console.log(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  }

  //get total balance get by shareholder
  const totalBalance = async (req, res) => {
      try {
        // Perform the aggregation to sum the column
        const result = await paymentModel.aggregate([
          { $group: { _id: null, total: { $sum: '$amountPaid' } } },
        ]);
    
        // Return the result as the response
        res.json(result[0].total);
      } catch (error) {
        console.error('Error summing column:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
  };

  const getLatest7DaysBalance=async(req,res) =>{
    try {
      // Calculate the start date by subtracting 7 days from the current date
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
  
      // Perform the aggregation to sum the column within the specified date range
      const result = await paymentModel.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: new Date() } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } },
      ]);
  
      // Return the result as the response
       res.json(result[0].total);
    } catch (error) {
      console.error('Error summing column:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }


  const eachMonthReport=async(req,res)=>{
    try {
      // Perform the aggregation to calculate the desired metrics for each month
      const result = await shareInfo.aggregate([
        {
          $match: {
            sharecatagory: 'ordinary'
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' }
            },
            franchisedCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            month: '$_id.month',
            franchisedCount: 1
          }
        }
      ]);
  
      // Return the monthly report as the response
      res.json(result);
    } catch (error) {
      console.error('Error generating monthly report:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }
  const countryOfEthiopis=async(req,res)=>{
     try {
      // const result=await shareholderModel.aggregate([
      //   {
      //     $match:{country:"Ethiopia"}
      //   },
      //   {
      //     $count:"totalNumberOfShareholdersInEthiopia"
      //   }
      // ]);
      // res.json(result[0].totalNumberOfShareholdersInEthiopia);
      const result = await shareholderModel.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
      ]);
      res.json(result);
     } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
     }
    
  }

  

  const  shareTypeAndTotalValue=async(req,res)=>{
    try{
    const result = await shareInfo.aggregate([
      { $group: { _id: '$shareCatagory', count: { $sum: 1 } } },
    ]);
    res.json(result);
   } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
   }
} 



  module.exports = {
    allShareholders,getLatest7DaysReportOfShareholders,
    totalBalance,getLatest7DaysBalance,
    eachMonthReport,countryOfEthiopis,
    shareTypeAndTotalValue}
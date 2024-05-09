const xlsx = require('xlsx');
const shareHoldersModel = require('../../../Models/ShareHolders/shareHoldersModel');

const convertToJson = async (req, res) => {
const paymentModel = require('../../../Models/Payment/paymentModel');
const shareInfoModel = require('../../../Models/ShareHolders/shareInfoModel');
  try {
    // Read the XLSX file
    const workbook = xlsx.readFile('file/database2.xlsx');

    // Define the sheet names
    const sheetNames = ['shareholder', 'share', 'payment'];

    // Convert each sheet to JSON
    const jsonData = sheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      return xlsx.utils.sheet_to_json(worksheet);
    });

    // Extract the data from each sheet
    const shareholderData = jsonData[0];
    const shareInfoData = jsonData[1];
    const paymentData = jsonData[2];

    // Create a map to store the related share info data
    const shareInfoMap = new Map();

    // Iterate through each share info data
    for (const shareInfo of shareInfoData) {
      const shareInfoId = shareInfo._id;

      // Add the share info data to the map using _id as the key
      if (!shareInfoMap.has(shareInfoId)) {
        shareInfoMap.set(shareInfoId, []);
      }
      shareInfoMap.get(shareInfoId).push(shareInfo);
    }

    // Create a map to store the related payment data
    const paymentMap = new Map();

    // Iterate through each payment data
    for (const payment of paymentData) {
      const paymentId = payment._id;

      // Add the payment data to the map using _id as the key
      if (!paymentMap.has(paymentId)) {
        paymentMap.set(paymentId, []);
      }
      paymentMap.get(paymentId).push(payment);
    }

    // Iterate through each shareholder data
    for (const shareholder of shareholderData) {
      const shareholderId = shareholder._id;

      // Create a new shareholder model
      const shareholderModel = new shareHoldersModel({
        _id: shareholderId,
        // Include other properties from the shareholder sheet as needed
        // For example: name: shareholder.name
      });

      // Get the related share info data based on the shareholder ID
      const relatedShareInfoData = shareInfoMap.get(shareholderId) || [];

      // Iterate through each related share info data
      for (const shareInfoData of relatedShareInfoData) {
        // Create a new share info model
        const shareInfoModel = new shareInfoModel({
          _id: shareInfoData._id,
          // Include other properties from the share info sheet as needed
          // For example: date: shareInfoData.date
        });

        // Add the share info model to the shareholder model
        shareholderModel.shareInfo.push(shareInfoModel);
      }

      // Get the related payment data based on the shareholder ID
      const relatedPaymentData = paymentMap.get(shareholderId) || [];

      // Iterate through each related payment data
      for (const paymentData of relatedPaymentData) {
        // Create a new payment model
        const paymentModel = new paymentModel({
          _id: paymentData._id,
          // Include other properties from the payment sheet as needed
          // For example: amount: paymentData.amount
        });

        // Add the payment model to the shareholder model
        shareholderModel.payments.push(paymentModel);
      }

      // Save the shareholder model to the database
      await shareholderModel.save();
    }

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error occurred while processing the data' });
  }
};
module.exports={convertToJson}
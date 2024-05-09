const express=require('express');
const validateToken=require('../../middleware/validateTokenHandler');
const multer=require('multer');

const dashboardControllers=require('../../Controllers/Controller/Admin/dashboardOverviewController')
const pendingUserController=require('../../Controllers/Controller/Admin/pendingShareholdersController')
const shareholderController=require('../../Controllers/Controller/Admin/shareholderController');
const shareholderAddController=require('../../Controllers/Controller/Admin/registerShareholder');
const shareController=require('../../Controllers/Controller/Admin/shareController');
const convertToJsonController=require('../../Controllers/Controller/Admin/xlsxConvertToJsonAndSave');
const testContoller=require('../../Controllers/Controller/Admin/testController');
const paymentOrderController=require('../../Controllers/Controller/Admin/adminOrderApprove');

const Router=express.Router();
const upload = multer({ dest: 'uploads/' });

  Router.get('/all-shareholders',dashboardControllers.allShareholders);
  Router.get('/shareholders-per-weekly',dashboardControllers.getLatest7DaysReportOfShareholders);
  Router.get('/total-balance',dashboardControllers.totalBalance);
  Router.get('/balance-per-weekly',dashboardControllers.getLatest7DaysBalance);
  Router.get('/monthly-report',dashboardControllers.eachMonthReport);
  Router.get('/all-country-value',dashboardControllers.countryOfEthiopis);
  Router.get('/share-type-total',dashboardControllers.shareTypeAndTotalValue);
  Router.get('/all-shareholder-data',shareholderController.allShareholderData);
  Router.get('/all-pending-user-data',pendingUserController.allPendingUserData);
  // detail route
  // Router.get('/shareholders/:id',shareholderController.shareholderDetail);
  Router.get('/shareholders/:id',shareholderController.shareholderDetail);

  Router.get('/shareholder_share_info/:id',shareholderController.shareholderShareInfo);
  Router.get('/shareholder_payment_detail/:id',shareholderController.shareholderPaymentDetail);
  // Router.get('/shareholder_detail_info/:id',shareholderController.shareholderDetailInfo);
  Router.get('/shareholder_payment_history/:id',shareholderController.shareholderPaymentHistory);
  // shareholder payment
  // Router.get('/payments/:id',shareholderController.shareholderPayment);
  
  //register/add/create new shareholder
  Router.post('/shareholder/add',upload.single('image'), shareholderAddController.registerShareholder);
  
  // update Balance
  Router.post('/shareholder/balance/update/:id',shareController.updateBalanceController);
  Router.delete('/shareholder/delete/:id',shareholderController.deleteShareholder);


  // pending user API
  Router.get('/pending/:id',pendingUserController.pendingUserDetail);
  Router.get('/pending-to-shareholder/:id',pendingUserController.pendingUserSaveInToShareholder);

  // convert to json
  Router.get('/converter',convertToJsonController.processData);//to pendding model
  Router.get('/new',convertToJsonController.convertToJson);//to all models
  Router.get('/missing',convertToJsonController.missingShares);//to all models
  Router.get('/payment',convertToJsonController.payment);//to all models
  Router.get('/test',testContoller.convertToJson);//to all models


  // paymet Order Approval
  Router.get('/get-order-approval/:id',paymentOrderController.paymentOrderApproval);
  Router.get('/get-order-data',paymentOrderController.getPaymentOrderData);
  Router.get('/payment-order-detail-info/:id',paymentOrderController.detailInfoOfPaymentOrder);
  

 



module.exports=Router;


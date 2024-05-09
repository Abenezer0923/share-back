var express = require("express");
var router = express.Router();
const controller = require("../../Controllers/index");

//Admin Auth Controller
const adminAuthConroller=require('../../Controllers/Controller/Auth/adminAuthController');
const validateToken=require('../../middleware/validateTokenHandler');
const Router=express.Router();


 // admin Auth Roues
 router.post('/admin/register',adminAuthConroller.registeUser);
 router.post('/admin/login',adminAuthConroller.loginUser);
 router.get('/admin/current',adminAuthConroller.currentUser);
//  router.get('/admin/logout',adminAuthConroller.logout);

router.post("/login", controller.authController.login);
router.post("/verifyOTP", controller.authController.verifyOtp);
router.post("/forgotPassword", controller.authController.forgotpassword);
router.post("/updatePassword", controller.authController.updatePasswordLink);
router.post("/updatePassword/:token", controller.authController.restPasswordByEmail);
router.post("/verifyToken", controller.authController.verifypasswordresettoken);
router.post("/resetPassword/:id/:token", controller.authController.restPassword);


module.exports = router;

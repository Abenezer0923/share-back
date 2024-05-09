var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var paymentOrderSchema = new Schema({
  amountSubscribed:String,
  numberOfShare:String,
  bill_ref_number: String,
  paymentMethod: String,
  phoneNumber: String,
  acc_No:String,  
  paymentStatus: String,

  shareHolder: {
    type: Schema.Types.ObjectId,
    ref: "shareHolder",
  },
  //walle
  shareInfo:{
    type: Schema.Types.ObjectId,
    ref: "shareInfo",
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "payment",
  },
  amount: Number,
  shareCatagory: String,
  shareType:String,

  percentage: String,
  completed: Boolean,
  image: String 
});
paymentOrderSchema.set("timestamps", true);

module.exports = mongoose.model("paymentOrder", paymentOrderSchema);

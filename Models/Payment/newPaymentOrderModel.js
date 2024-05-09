var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var newPaymentOrderSchema = new Schema({
  bill_ref_number: String,
  paymentMethod: String,
  phoneNumber: String,
  acc_No:String,
  amount_birr: String,
  
  paymentStatus: String,
  shareHolder: {
    type: Schema.Types.ObjectId,
    ref: "shareHolder",
  },
//   payment: {
//     type: Schema.Types.ObjectId,
//     ref: "payment",
//   },
  amount: Number,
  shareCatagory: String,
  percentage: String,
//   completed: Boolean,
  image: String 
});
newPaymentOrderSchema.set("timestamps", true);

module.exports = mongoose.model("newPaymentOrder", newPaymentOrderSchema);
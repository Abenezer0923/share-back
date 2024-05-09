var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var penddingPaymentSchema = new Schema({
  transaction_id: String,
  bill_ref_number: String,
  paymentMethod: String,
  transaction_time:String,
  phone_number:String,
  phoneNumber: String,
  status: String,
  acc_No:Number,
  shareHolder: {
    type: Schema.Types.ObjectId,
    ref: "shareHolder",
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "payment",
  },
  amount: Number,
  percentage: String,

});
penddingPaymentSchema.set("timestamps", true);

module.exports = mongoose.model("penddingPayment", penddingPaymentSchema);
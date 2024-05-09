var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var paymentHistorychema = new Schema({
  transaction_id: String,
  transaction_time: String,
  paidAmount: String,
  payment: {
    type: Schema.Types.ObjectId,
    ref: "payment",
  },
  paymentOrder: {
    type: Schema.Types.ObjectId,
    ref: "paymentOrder",
  },
  phone_number: String,
  paymentMethod: String,
  bill_ref_number: String,
  status: String,
  manual_receipt_issued: {
    type: Boolean,
    default: false,
  },
  manual_receipt_number: {
    type: String,
  },
});
paymentHistorychema.set("timestamps", true);

module.exports = mongoose.model("payment_history", paymentHistorychema);

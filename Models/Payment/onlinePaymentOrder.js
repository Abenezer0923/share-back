var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var onlinePaymentSchema = new Schema({
    bill_ref_number: String,
    paymentMethod: String,
    amount_birr: String,
    
    paymentStatus: String,
    shareHolder: {
      type: Schema.Types.ObjectId,
      ref: "shareHolder",
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "payment",
    },
    amount: Number,
    shareCatagory: String,
    percentage: String,
    completed: Boolean,
});
onlinePaymentSchema.set("timestamps", true);

module.exports = mongoose.model("onlinePaymentSchema", onlinePaymentSchema);
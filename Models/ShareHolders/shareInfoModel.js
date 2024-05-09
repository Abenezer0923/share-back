var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var shareInfoSchema = new Schema({
  numberOfShare: Number,
  amountSubscribed: Number,
  shareCatagory: String,
  shareType: String,
  shareHolder: {
    type: Schema.Types.ObjectId,
    ref: "shareHolder",
  },
  paymentStarted: {
    type: Boolean,
    default: false,
  },
  paymentCompleted: {
    type: Boolean,
    default: false,
  },
  Certified: {
    type: Boolean,
    default: false,
  },
  FID:String,
  ID:String,
  typeOfData:String,
});
shareInfoSchema.set("timestamps", true);

module.exports = mongoose.model("shareInfo", shareInfoSchema);

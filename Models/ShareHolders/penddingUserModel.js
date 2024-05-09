var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var penddingUserSchema = new Schema({
  first_name: String,
  middle_name: String,
  last_name: String,
  agent: {
    type: Schema.Types.ObjectId,
    ref: "agent",
  },
  address: String,
  house_number: String,
  country: String,
  state: String,
  city: String,
  zipCode: String,
  email: String,
  phoneNumber: String,
  numberOfShare: String,
  amountSubscribed: String,
  amountPaid: String,
  bill_ref_number: String,
  paymentMethod: String,
  shareCatagory: String,
  shareType: String,
  completed: {
    type: Boolean,
    default: false,
  },
  image:String,
  ID:String,
  pid:String,
  sid:String,
  FID:String,
});

penddingUserSchema.set("timestamps", true);

module.exports = mongoose.model("penddingUser", penddingUserSchema);



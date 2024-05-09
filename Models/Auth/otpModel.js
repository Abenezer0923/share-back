var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var otpSchema = new Schema({
  email: String,
  otp: String,
  status: {
    type: Boolean,
    default: false,
  },
});

otpSchema.set("timestamp", true);

module.exports = mongoose.model("otp", otpSchema);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var forgotpasswordSchema = new Schema({
  email: String,
  token: String,
  done: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

forgotpasswordSchema.set("timestamps", true);

module.exports = mongoose.model("forgotpassword", forgotpasswordSchema);

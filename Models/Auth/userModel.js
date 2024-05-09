var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    default: "USER",
  },
});

userSchema.set("timestamp", true);

module.exports = mongoose.model("user", userSchema);

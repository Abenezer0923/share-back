var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var loginsSchema = new Schema({
  ip: {
    type: String,
  },
  device: {
    type: String,
  },
  user_agent: {
    type: String,
  },
  user_type: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

loginsSchema.set("timestamps", true);

module.exports = mongoose.model("login", loginsSchema);

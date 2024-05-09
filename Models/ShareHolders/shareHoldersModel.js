var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var shareHolderSchema = new Schema({
  first_name: String,
  middle_name: String,
  last_name:String,
  // agent: {
  //   type: Schema.Types.ObjectId,
  //   ref: "agent",
  // },
  address: String,
  house_number: String,
  state: String,
  city: String,
  country: String,
  zipCode: String,
  email: String,
  phone: String,
  image:String,
  ID:String,
  amharicName:String,
  entryStatus:Boolean,

  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
shareHolderSchema.set("timestamps", true);

module.exports = mongoose.model("shareHolder", shareHolderSchema);

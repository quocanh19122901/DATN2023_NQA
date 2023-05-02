const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  address: { type: String },
  phone: { type: String },
  avatar: { type: String },
});
module.exports = mongoose.model("Profiles", profileSchema);

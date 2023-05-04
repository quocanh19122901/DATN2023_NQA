const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: { type: String },
  address: { type: String },
  phone: { type: String },
  birthday: { type: String },
  avatar: {
    type: String,
    default: "https://cdn-01.dhcnhn.vn/img/logo-haui-size.png",
  },
});
module.exports = mongoose.model("Profiles", profileSchema);

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  OrderId: { type: String, required: true },
  problem: { type: String, required: true },
  desire: { type: String, required: true },
});
module.exports = mongoose.model("Contacts", contactSchema);

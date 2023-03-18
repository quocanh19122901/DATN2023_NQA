const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema(
  {
    userId :{
      userId: {type: mongoose.Schema.Types.ObjectId, required : true}
    },
    Name: { type: String, required: true },
    Phone: { type: String, required: true },
    Address: { type: String, required: true },
    Avatar:{ type: String},
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);

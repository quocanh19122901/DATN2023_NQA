const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    CategoryName: { type: String, require: true },
    Description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

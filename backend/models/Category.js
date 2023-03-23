const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    CategoryName: { type: String },
    SubCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", CategorySchema);

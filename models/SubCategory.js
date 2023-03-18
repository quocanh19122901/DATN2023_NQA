const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    SubCategoryName: { type: String, require: true },
    Description: { type: String },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", categorySchema);

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    SubCategoryName: { type: String, require: true },
    Description: { type: String },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", categorySchema);

const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    SubCategoryName: { type: String, require: true },
    Description: { type: String },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subcategorySchema);

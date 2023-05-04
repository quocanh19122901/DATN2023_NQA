const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    SubCategoryName: { type: String, require: true },
    Description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subcategorySchema);

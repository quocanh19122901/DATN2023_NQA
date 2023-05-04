const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    CategoryName: { type: String, required: true },
    SubCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", CategorySchema);

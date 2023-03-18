const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    productName: { type: String, required: true,unique: true  },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    quantity: {type :Number, required :true},
    size: { type: String,required :true },
    color: { type: String,required :true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);

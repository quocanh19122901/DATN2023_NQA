const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    productName: { type: String, required: true, unique: true },
    desc: [{ type: String, required: true }],
    avatar: { type: String, required: true },
    img: [{ type: String, required: true }],
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    quantity: { type: Number, required: true },
    size: [{ type: String, required: true }],
    color: [{ type: String, required: true }],
    price: { type: Number, required: true },
    sold: { type: Number, default: 1 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);

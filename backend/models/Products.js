const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    productName: { type: String, required: true, unique: true },
    desc: [{ type: Array, required: true }],
    avatar: { type: String, required: true },
    img: [{ type: Array, required: true }],
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    quantity: { type: Number, required: true },
    size: [{ type: Array, required: true }],
    color: [{ type: Array, required: true }],
    price: { type: Number, required: true },
    sold: { type: Number, default: 1 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);

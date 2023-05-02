const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          required: true,
          type: Number,
        },
        size: {
          required: true,
          type: String,
        },
        color: {
          required: true,
          type: String,
        },
        price: {
          required: true,
          type: Number,
        },
      },
    ],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Đang xử lý đơn hàng..." },
    note: { type: String },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);

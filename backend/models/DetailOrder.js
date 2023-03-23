const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    OrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);

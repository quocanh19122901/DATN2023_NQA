const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
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
          type: Array,
        },
        color: {
          required: true,
          type: Array,
        },
        price: {
          required: true,
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Cart", CartSchema);

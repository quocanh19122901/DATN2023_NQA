const mongoose = require ("mongoose");

const CartSchema =  new mongoose.Schema(
{
    userId: { type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,},
},
    {timestamps: true}
);
module.exports = mongoose.model("Cart",CartSchema);
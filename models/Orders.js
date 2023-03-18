const mongoose = require ("mongoose");

const OrderSchema =  new mongoose.Schema(
{
    userId: { type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,},
    product: [
        {
            productId:{
                type: String,
            },
            quantity:{
                type: Number,
                default: 1,
            },
        },
    ],
    phone: {type: String, required: true},
    amount: {type: Number, required: true},
    address:{type: Object, required: true},
    status: {type: String, default: "pending"},
},
    {timestamps: true}
);
module.exports = mongoose.model("Order",OrderSchema);
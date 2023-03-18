const mongoose = require ("mongoose");

const CategorySchema =  new mongoose.Schema(
{
    CategoryName: {type: String},
},
    {timestamps: true}
);
module.exports = mongoose.model("Category",CategorySchema);
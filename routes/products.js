const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAmin } = require("./verifyToken");
const Product = require("../models/Products")
const router = require("express").Router();

//CREATE
router.post("/",verifyTokenAndAmin,async(req,res)=>{
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (error) {
        res.status(500).json(error);
    }
})
//UPDATE 
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=> {
   try {
    const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
    },{new:true})
    res.status(200).json(updateProduct);

   } catch (error) {
    res.status(500).json(err);
   }
})


//DELETE
router.delete("/:id",verifyTokenAndAmin, async (req,res) => {
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted !")
    }catch(err){
        res.status(500).json(err);
    }
})

//GET PRODUCT
router.get("/find/:id",verifyTokenAndAmin, async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
})
//GET ALL PRODUCT
router.get("/", async (req,res) => {
    const qNew = req.query.new;
    const qCategory  = req.query.category;
    try{
        let products ;
        if(qNew) {
            products = await Products.find().sort({createAt: -1}).limit(5);
        }else if (qCategory) {
            products = await Product.find({category:{
                $in: [qCategory],
            },
        });
        }else {
            products = await Product.find();
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});

// //GET USER STAT

// router.get("/stats", verifyTokenAndAmin, async (req, res)=>{
//    const date = new Date();
//    const lastYear = new Date(date).setFullYear(date.getFullYear() - 1);
//    try {
//         const data = await User.aggregate([
//             {$match : {createdAt : {$gte : lastYear } } },
//             {
//                 $project :{
//                     month: {$month : "$createdAt"}
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$month",
//                     total : {$sum: 1},
//                 }
//             }
//         ]);
//         res.status(200).json(data);
//    } catch (Err) {
//         res.status (500).json(err);
//    } 
// })
module.exports = router;


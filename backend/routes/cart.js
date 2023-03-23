const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAmin } = require("./verifyToken");
const Cart = require("../models/Cart")
const router = require("express").Router();

//CREATE
router.post("/",async(req,res)=>{
    const newCart = new Cart(req.body);
    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart);
    } catch (error) {
        res.status(500).json(error);
    }
})
//UPDATE 
router.put("/:id", async (req,res)=> {
   try {
    const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: req.body
    },{new:true})
    res.status(200).json(updateCart);

   } catch (error) {
    res.status(500).json(err);
   }
})


//DELETE
router.delete("/:id", async (req,res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted !")
    }catch(err){
        res.status(500).json(err);
    }
})

//GET Cart
router.get("/find/:id",verifyTokenAndAmin, async (req,res) => {
    try{
        const Cart = await Cart.findById(req.params.id);
        res.status(200).json(Cart);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports = router;


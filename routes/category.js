const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAmin } = require("./verifyToken");
const Categories = require("../models/Categories");
const router = require("express").Router();

//CREATE
router.post("/",verifyTokenAndAmin,async(req,res)=>{
    const newCategories = new Categories(req.body);
    try {
        const saveCategories = await newCategories.save();
        res.status(200).json(saveCategories);
    } catch (error) {
        res.status(500).json(error);
    }
})
//UPDATE 
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=> {
   try {
    const updateCategories = await Categories.findByIdAndUpdate(req.params.id, {
        $set: req.body
    },{new:true})
    res.status(200).json(updateCategories);

   } catch (error) {
    res.status(500).json(err);
   }
})


//DELETE
router.delete("/:id",verifyTokenAndAmin, async (req,res) => {
    try{
        await Categories.findByIdAndDelete(req.params.id)
        res.status(200).json("Category has been deleted !")
    }catch(err){
        res.status(500).json(err);
    }
})

//GET Categories
router.get("/find/:id", async (req,res) => {
    try{
        const Category = await Categories.findById(req.params.id);
        res.status(200).json(Category);
    }catch(err){
        res.status(500).json(err);
    }
})
//GET ALL Categories
router.get("/", async (req,res) => {
    const query = req.query.new
    try{
        const users = query 
        ? await Categories.find().sort({_id: -1}).limit(5)
        : await Categories.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;


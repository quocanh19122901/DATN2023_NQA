const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAmin } = require("./verifyToken");
const SubCategories = require("../models/SubCategory");
const router = require("express").Router();

//CREATE
router.post("/",verifyTokenAndAmin,async(req,res)=>{
    try {
        const {SubCategoryName} = req.body;
        // Kiểm tra xem SubCategory đã tồn tại trong cơ sở dữ liệu hay chưa
        const existingSubCategory = await SubCategories.findOne({$or: [{SubCategoryName}]});
        if (existingSubCategory) {
          return res.status(400).json({ error: "Subcategory already exists" });
        }
        // Nếu chưa có SubCategory, tạo mới SubCategory
        const newSubCategory = new SubCategories(req.body);
        const saveSubCategory = await newSubCategory.save();
        res.status(200).json(saveSubCategory);
      } catch (error) {
        res.status(500).json(error);
      }
})
//UPDATE 
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=> {
   try {
    const updateSubCategories = await SubCategories.findByIdAndUpdate(req.params.id, {
        $set: req.body
    },{new:true})
    res.status(200).json(updateSubCategories);
   } catch (error) {
    res.status(500).json(err);
   }
})


//DELETE
router.delete("/:id",verifyTokenAndAmin, async (req,res) => {
    try{
        await SubCategories.findByIdAndDelete(req.params.id)
        res.status(200).json("Category has been deleted !")
    }catch(err){
        res.status(500).json(err);
    }
})

//GET SubCategories
router.get("/find/:id", async (req,res) => {
    try{
        const Category = await SubCategories.findById(req.params.id);
        res.status(200).json(Category);
    }catch(err){
        res.status(500).json(err);
    }
})
//GET ALL SubCategories
router.get("/", async (req,res) => {
    const query = req.query.new
    try{
        const users = query 
        ? await SubCategories.find().sort({_id: -1}).limit(5)
        : await SubCategories.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;


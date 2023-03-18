const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAmin } = require("./verifyToken");
const Category = require("../models/Category");
const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAmin, async (req, res) => {
  try {
    const {CategoryName} = req.body;
    // Kiểm tra xem Category đã tồn tại trong cơ sở dữ liệu hay chưa
    const existingCategory = await Category.findOne({$or: [{CategoryName}]});
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }
    // Nếu chưa có Category, tạo mới Category
    const newCategory = new Category(req.body);
    const saveCategory = await newCategory.save();
    res.status(200).json(saveCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});
//UPDATE 
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=> {
   try {
    const updateCategory = await Category.findByIdAndUpdate(req.params.id, {
        $set: req.body
    },{new:true})
    res.status(200).json(updateCategory);

   } catch (error) {
    res.status(500).json(err);
   }
})


//DELETE
router.delete("/:id",verifyTokenAndAmin, async (req,res) => {
    try{
        await Category.findByIdAndDelete(req.params.id)
        res.status(200).json("Category has been deleted !")
    }catch(err){
        res.status(500).json(err);
    }
})

//GET Category
router.get("/find/:id", async (req,res) => {
    try{
        const MainCategory = await Category.findById(req.params.id);
        res.status(200).json(MainCategory);
    }catch(err){
        res.status(500).json(err);
    }
})
//GET ALL Category
router.get("/", async (req,res) => {
    const query = req.query.new
    try{
        const users = query 
        ? await Category.find().sort({_id: -1}).limit(5)
        : await Category.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;


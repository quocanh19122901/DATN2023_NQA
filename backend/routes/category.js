const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const Category = require("../models/Categories");
const router = require("express").Router();
var cors = require("cors");
router.use(cors());
//CREATE
router.post("/", async (req, res) => {
  try {
    const { CategoryName } = req.body;
    // Kiểm tra xem Category đã tồn tại trong cơ sở dữ liệu hay chưa
    const existingCategory = await Category.findOne({
      $or: [{ CategoryName }],
    });
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
router.put("/:id", async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updateCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updateCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json("Category has been deleted !");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Category
router.get("/:id", async (req, res) => {
  try {
    const MainCategory = await Category.findById(req.params.id).populate(
      "SubCategory"
    );
    res.status(200).json(MainCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL Category
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("SubCategory")
      .sort({ _id: -1 })
      .limit(100);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

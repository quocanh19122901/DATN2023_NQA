const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const SubCategories = require("../models/SubCategory");
const router = require("express").Router();
var cors = require("cors");
router.use(cors());
//CREATE
router.post("/", async (req, res) => {
  try {
    const { SubCategoryName, Descriptio } = req.body;
    // Kiểm tra xem SubCategory đã tồn tại trong cơ sở dữ liệu hay chưa
    const existingSubCategory = await SubCategories.findOne({
      $or: [{ SubCategoryName }],
    });
    if (existingSubCategory) {
      return res.status(400).json({ error: "Subcategory already exists" });
    }

    const newsubCategory = new SubCategories(req.body);
    const savesubCategory = await newsubCategory.save();
    res.status(200).json(savesubCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updateSubCategories = await SubCategories.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateSubCategories);
  } catch (error) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAmin, async (req, res) => {
  try {
    await SubCategories.findByIdAndDelete(req.params.id);
    res.status(200).json("Category has been deleted !");
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", async (req, res) => {
  try {
    const subCategory = await SubCategories.find();
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json("err");
  }
});
//GET SubCategories
router.get("/:id", async (req, res) => {
  try {
    const subCategory = await SubCategories.findById(req.params.id);
    res.status(200).json(subCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET ALL SubCategories

module.exports = router;

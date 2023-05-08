const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const Product = require("../models/Products");
const router = require("express").Router();
const cors = require("cors");
router.use(cors());
//CREATE
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const saveProduct = await newProduct.save();
    res.status(200).json(saveProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});
//UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: { status: "Ngừng kinh doanh" },
    });
    res.status(200).json(deleteProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
//SEARCH
router.get("/search", async (req, res) => {
  let { productName } = req.query;
  try {
    // Thay thế các kí tự đặc biệt và khoảng trắng bằng dấu "\"
    productName = productName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Tách các từ khóa bằng khoảng trắng và tìm kiếm với $regex
    const keywords = productName.split(/\s+/);
    const regex = new RegExp(keywords.join("|"), "i");
    const products = await Product.find({ productName: regex });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "CategoryId"
    );
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ CategoryId: categoryId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//GET ALL PRODUCT
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("CategoryId")
      .sort({ _id: 1 })
      .limit(100);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/top/bestselling", async (req, res) => {
  try {
    const products = await Product.find().sort({ sold: -1 }).limit(3);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;

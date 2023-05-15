const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const Product = require("../models/Products");
const Order = require("../models/Orders");
const router = require("express").Router();
const cors = require("cors");
router.use(cors());
//CREATE
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    // cloudinary.config({
    //   cloud_name: "sample",
    //   api_key: "874837483274837",
    //   api_secret: "a676b67565c6767a6767d6767f676fe1",
    //   secure: true,
    const saveProduct = await newProduct.save();

    // });
    // const image = await cloudinary.uploader.upload("my_image.jpg");

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
      "SubCategoryId"
    );
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/subcategory/:subCategoryId", async (req, res) => {
  const subcategoryId = req.params.subCategoryId;
  try {
    const products = await Product.find({ SubCategoryId: subcategoryId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//GET ALL PRODUCT
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("SubCategoryId")
      .sort({ _id: 1 })
      .limit(100);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/top/bestselling", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Lấy tháng hiện tại (từ 0 - 11)

    const startDate = new Date(currentDate.getFullYear(), currentMonth - 1, 1); // Ngày đầu tiên của tháng
    const endDate = new Date(currentDate.getFullYear(), currentMonth, 0); // Ngày cuối cùng của tháng

    const products = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          status: "Đã xác nhận", // Lọc theo trạng thái đã xác nhận
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$product.productId",
          totalSold: { $sum: "$product.quantity" },
        },
      },
      {
        $lookup: {
          from: "products", // Tên collection chứa thông tin sản phẩm
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 3,
      },
    ]);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/top/alltime", async (req, res) => {
  try {
    const products = await Product.find({ status: "Đang bày bán" })
      .sort({ sold: -1 })
      .limit(20);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;

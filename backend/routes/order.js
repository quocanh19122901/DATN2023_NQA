const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const router = require("express").Router();
const Order = require("../models/Orders");
const Cart = require("../models/Carts");
const Product = require("../models/Products");
var cors = require("cors");
router.use(cors());
//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const saveOrder = await newOrder.save();

    const cart = await Cart.find({ userId: req.user.id });
    for (let index = 0; index < cart.length; index++) {
      const product = await Product.findById(cart[index].product[0].productId);
      const updateProduct = await Product.findByIdAndUpdate(
        cart[index].product[0].productId,
        {
          $set: {
            quantity: product.quantity - cart[index].product[0].quantity,
            sold: product.sold + cart[index].product[0].quantity,
          },
        },
        { new: true }
      );
    }
    await Cart.deleteMany({ userId: req.user.id });
    res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: "Đã xác nhận" },
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).json(err);
  }
});

//GET USER ORDER
router.get("/myorder", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate(
      "product.productId"
    );
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/myorder/:id", async (req, res) => {
  try {
    const orderDetail = await Order.findById(req.params.id).populate(
      "product.productId"
    );
    res.status(200).json(orderDetail);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET ALL
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/income", verifyTokenAndAmin, async (req, res) => {
  try {
    // Lấy thông tin doanh thu và số lượng đơn hàng của từng tháng
    const monthlyData = await Order.aggregate([
      {
        $match: {
          status: "Đã xác nhận",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    res.status(200).json({ monthlyData });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

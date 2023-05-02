const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const router = require("express").Router();
const Order = require("../models/Orders");
var cors = require("cors");
router.use(cors());
//CREATE
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const saveOrder = await newOrder.save();
    res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).json("error");
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

//GET MONTHLY INCOME

router.get("/income", verifyTokenAndAmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createAt: {
            $gte: prevMonth,
          },
        },
      },
      {
        $project: {
          month: { $month: "createAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const router = require("express").Router();
const Order = require("../models/Orders");
const Cart = require("../models/Carts");
const Product = require("../models/Products");
const mongoose = require("mongoose");
var cors = require("cors");
router.use(cors());
//CREATE
// router.post("/", verifyToken, async (req, res) => {
//   const newOrder = new Order(req.body);
//   try {
//     const cart = await Cart.find({ userId: req.user.id });

//     for (let index = 0; index < cart.length; index++) {
//       const cartProduct = cart[index].product[0];
//       const product = await Product.findById(cartProduct.productId);

//       if (cartProduct.quantity > product.quantity) {
//         // Nếu số lượng trong giỏ hàng lớn hơn số lượng sản phẩm
//         return res.status(400).json({ error: "Số lượng sản phẩm không đủ." });
//       }
//       const updateProduct = await Product.findByIdAndUpdate(
//         cartProduct.productId,
//         {
//           $set: {
//             quantity: product.quantity - cartProduct.quantity,
//             sold: product.sold + cartProduct.quantity,
//           },
//         },
//         { new: true }
//       );
//     }

//     // Nếu kiểm tra số lượng thành công, tiếp tục tạo đơn hàng
//     const saveOrder = await newOrder.save();
//     await Cart.deleteMany({ userId: req.user.id });

//     res.status(200).json(saveOrder);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const cart = await Cart.find({ userId: req.user.id });
    let totalQuantityInCart = 0; // Biến để lưu tổng số lượng sản phẩm trong giỏ hàng

    for (let index = 0; index < cart.length; index++) {
      const cartProduct = cart[index].product[0];
      totalQuantityInCart += cartProduct.quantity; // Tính tổng số lượng sản phẩm trong giỏ hàng

      const product = await Product.findById(cartProduct.productId);

      if (cartProduct.quantity > product.quantity) {
        // Nếu số lượng trong giỏ hàng lớn hơn số lượng sản phẩm
        return res.status(400).json({ error: "Số lượng sản phẩm không đủ." });
      }
    }

    // So sánh tổng số lượng sản phẩm trong giỏ hàng với số lượng sản phẩm trong bảng sản phẩm
    const totalQuantityInProducts = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    if (totalQuantityInCart > totalQuantityInProducts[0].totalQuantity) {
      return res.status(400).json({ error: "Số lượng sản phẩm không đủ." });
    }

    for (let index = 0; index < cart.length; index++) {
      const cartProduct = cart[index].product[0];
      const product = await Product.findById(cartProduct.productId);

      const updateProduct = await Product.findByIdAndUpdate(
        cartProduct.productId,
        {
          $set: {
            quantity: product.quantity - cartProduct.quantity,
            sold: product.sold + cartProduct.quantity,
          },
        },
        { new: true }
      );
    }

    // Nếu kiểm tra số lượng thành công, tiếp tục tạo đơn hàng
    const saveOrder = await newOrder.save();
    await Cart.deleteMany({ userId: req.user.id });

    res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:orderId", verifyToken, async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status: "Đã hủy" },
      },
      { new: true }
    );
    for (let index = 0; index < order.product.length; index++) {
      const product = await Product.findById(order.product[index].productId);
      await Product.findByIdAndUpdate(product._id, {
        $set: {
          quantity: product.quantity + order.product[index].quantity,
        },
      });
    }

    res.status(200).json(order);
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
          _id: { $dateToString: { format: "%m-%Y", date: "$createdAt" } },
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

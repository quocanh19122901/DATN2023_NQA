const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const Cart = require("../models/Cart");
const router = require("express").Router();
var cors = require("cors");
router.use(cors());
//CREATE
router.post("/", async (req, res) => {
  const { userId, product } = req.body;

  if (!product || product.length === 0) {
    return res.status(400).json({ message: "Invalid product data" });
  }

  try {
    const { productId, size, color, price, quantity } = product[0];
    // kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
    const cart = await Cart.findOne({
      userId,
      "product.productId": productId,
      "product.size": size,
      "product.color": color,
    });
    if (cart) {
      // nếu sản phẩm đã có trong giỏ hàng, tăng số lượng sản phẩm lên 1
      const updatedCart = await Cart.findOneAndUpdate(
        {
          userId,
          "product.productId": productId,
          "product.size": size,
          "product.color": color,
          "product.price": price,
        },
        { $inc: { "product.$.quantity": quantity } },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } else {
      // nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
      const newCart = new Cart({
        userId,
        product: { productId, size, color, price, quantity },
      });
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (error) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted !");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const carts = await Cart.find({ userId: req.user.id }).populate(
      "product.productId"
    );
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

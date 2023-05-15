const User = require("../models/Users");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("../middleware/authLogin");

// Thêm middleware để cho phép truy cập từ các trang web khác
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

router.use(cookieParser());

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const existingEmail = await User.findOne({ email: req.body.email });
    const existingUsername = await User.findOne({
      username: req.body.username,
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    if (existingUsername) {
      return res.status(400).json({ message: "Tài khoản đã được sử dụng." });
    }

    // Tiếp tục quá trình đăng ký khi không có email hoặc tài khoản trùng
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
      isAdmin: req.body.isAdmin,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json("Sai thông tin tài khoản!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (OriginalPassword !== req.body.password) {
      return res.status(401).json("Sai thông tin tài khoản!");
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "30d" }
    );

    // Lưu JWT vào cookie
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    }); // JWT sẽ hết hạn sau 3 ngày

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
router.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard");
});
module.exports = router;

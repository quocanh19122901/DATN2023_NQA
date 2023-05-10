const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const Profiles = require("../models/Profiles");
var cors = require("cors");
router.use(cors());
router.post("/", async (req, res) => {
  const newProfile = new Profiles(req.body);
  try {
    const saveProfile = await newProfile.save();
    res.status(200).json(saveProfile);
  } catch (error) {
    res.status(500).json("error");
  }
});
router.get("/", verifyToken, async (req, res) => {
  try {
    const profile = await Profiles.find({ userId: req.user.id });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/", verifyToken, async (req, res) => {
  try {
    const updateProfile = await Profiles.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProfile);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

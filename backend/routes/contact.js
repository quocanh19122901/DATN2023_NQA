const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAmin,
} = require("./verifyToken");
const Contacts = require("../models/Contacts");
var cors = require("cors");
router.use(cors());
router.post("/", async (req, res) => {
  const newContact = new Contacts(req.body);
  try {
    const saveContact = await newContact.save();
    res.status(200).json(saveContact);
  } catch (error) {
    res.status(500).json("error");
  }
});
router.get("/", verifyToken, async (req, res) => {
  try {
    const contact = await Contacts.find({ userId: req.user.id });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;

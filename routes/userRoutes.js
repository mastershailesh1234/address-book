const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
//register
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(400).json("Wrong credentials!");
    }

    if (req.body.password != user.password) {
      return res.status(400).json("Wrong credentials!");
    }

    const token = jwt.sign({ id: user._id, name: user.name }, "addressbook");

    const { password, isAdmin, ...userDetails } = user._doc;
    return res.status(200).json({
      success: true,
      message: "successfull",
      jwt: `BEARER ${token}`,
      userDetails,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;

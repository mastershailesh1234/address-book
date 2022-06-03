const router = require("express").Router();
const Address = require("../models/addressModel");
const isAuthenticated = require("../middlewares/isAuthenticated");
//Add multi or single Address
router.post("/register", isAuthenticated, async (req, res, next) => {
  console.log(req.body);
  try {
    const address = await Address.insertMany(req.body);
    res.status(200).json({
      status: "Successful",
      messgae: address,
    });
  } catch (err) {
    next(err);
  }
});

//get a address using name and phase matching result
router.get("/find/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    const address = await Address.find({
      name: {
        $regex: `${name}`,
        $options: "i",
      },
    });
    if (!address) {
      return res.status(404).send("Not found");
    }
    return res.status(200).json({
      length: address.length,
      status: "Successful",
      message: address,
    });
  } catch (err) {
    next(err);
  }
});

//get using pagination
router.get("/all", async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    //paginate
    console.log(req.query.page, req.query.page);
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    if (req.query.page) {
      const num = await Address.countDocuments();
      if (skip >= num) throw new Error("This page does not exist");
    }

    const address = await Address.find(JSON.parse(queryStr))
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      results: address.length,
      data: {
        address,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Unsuccessful",
      message: err,
    });
  }
});

//update an address
router.put("/:name", isAuthenticated, async (req, res, next) => {
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { name: req.params.name },
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      status: "Successful",
      message: updatedAddress,
    });
  } catch (err) {
    next(err);
  }
});

//delete an address
router.delete("/:name", isAuthenticated, async (req, res, next) => {
  try {
    await Address.findOneAndDelete({ name: req.params.name });
    res.status(200).json("Address has been deleted.");
  } catch (err) {
    next(err);
  }
});
module.exports = router;

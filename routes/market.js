const authorize = require("../authorize"),
  router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  Post = require("../models/Post"),
  { rejectRequestWith, respondWith } = require("../logistics");

router.get("/hotdeals", authorize, async (req, res) => {
  try {
    if (req.user) {
      const hotDeals = await Post.find({
        pincode: req.user.location.pincode,
      }).sort({ likes: "desc" });
      respondWith(res, hotDeals);
    } else throw "User Unauthorised!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/deals", authorize, async (req, res) => {
  try {
    if (req.user) {
      const hotDeals = await Post.find({
        pincode: req.user.location.pincode,
      }).sort({ time: "desc" });
      respondWith(res, hotDeals);
    } else throw "User Unauthorised!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/trending", async (req, res) => {
  try {
    if (req.user) {
      const trending = await Post.find({
        time: { $gt: new Date().getTime() - 86400000 },
      }).sort({ likes: "desc" });
      respondWith(res, trending);
    } else throw "User Unauthorised!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

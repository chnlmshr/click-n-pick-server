const authorize = require("../authorize"),
  router = require("express").Router(),
  Post = require("../models/Post"),
  { rejectRequestWith, respondWith } = require("../logistics");

router.get("/hotdeals", authorize, async (req, res) => {
  try {
    const hotDeals = await Post.find({
      pincode: req.user.location.pincode,
    }).sort({ likes: "desc" });
    respondWith(res, hotDeals);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/deals", authorize, async (req, res) => {
  try {
    const hotDeals = await Post.find({
      pincode: req.user.location.pincode,
    }).sort({ time: "desc" });
    respondWith(res, hotDeals);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/trending", async (req, res) => {
  try {
    const trending = await Post.find({
      time: { $gt: new Date().getTime() - 86400000 },
    }).sort({ likes: "desc" });
    respondWith(res, trending);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

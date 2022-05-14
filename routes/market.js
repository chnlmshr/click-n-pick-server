const authorize = require("../authorize"),
  router = require("express").Router(),
  Post = require("../models/Post"),
  { rejectRequestWith, respondWith } = require("../logistics");

router.get("/hotdeals", authorize, async (req, res) => {
  try {
    const hotDeals = await Post.find({
      pincode: req.user.location.pincode,
    })
      .populate("vendor", "_id username shopName profileImage")
      .sort({ likes: "desc" });
    respondWith(res, hotDeals);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/deals", authorize, async (req, res) => {
  try {
    const hotDeals = await Post.find({
      pincode: req.user.location.pincode,
    })
      .populate("vendor", "_id username shopName profileImage")
      .sort({ time: "desc" });
    respondWith(res, hotDeals);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/trending", async (req, res) => {
  try {
    let trending = await Post.find({
      time: { $gt: new Date().getTime() - 86400000 },
    })
      .populate("vendor", "_id username shopName profileImage")
      .sort({ likes: "desc" });
    if (trending.length < 3)
      trending = await Post.find({
        time: { $gt: new Date().getTime() - 62208000000 },
      })
        .populate("vendor", "_id username shopName profileImage")
        .sort({ likes: "desc" });
    respondWith(res, trending);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

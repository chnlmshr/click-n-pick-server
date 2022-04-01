const authorizeVendor = require("../authorize/vendor"),
  authorizeCustomer = require("../authorize/customer"),
  router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  Post = require("../models/Post");

router.get("/c/hotdeals", authorizeCustomer, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const location = await Customer.findById(req.userid).select(
        "location -_id"
      );
      const hotDeals = await Post.find({
        pincode: location.pincode,
      }).sort({ likes: "desc" });
      res.send({ success: true, hotDeals: hotDeals });
    } catch (error) {
      res.send({ success: false, error: error.toStirng() });
    }
  }
});

router.get("/v/hotdeals", authorizeVendor, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const location = await Vendor.findById(req.userid).select(
        "location -_id"
      );
      const hotDeals = await Post.find({
        pincode: location.pincode,
      }).sort({ likes: "desc" });
      res.send({ success: true, hotDeals: hotDeals });
    } catch (error) {
      res.send({ success: false, error: error.toStirng() });
    }
  }
});

router.get("/v/deals", authorizeVendor, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const location = await Vendor.findById(req.userid).select(
        "location -_id"
      );
      const hotDeals = await Post.find({
        pincode: location.pincode,
      }).sort({ time: "desc" });
      res.send({ success: true, hotDeals: hotDeals });
    } catch (error) {
      res.send({ success: false, error: error.toStirng() });
    }
  }
});

router.get("/c/deals", authorizeVendor, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const location = await Customer.findById(req.userid).select(
        "location -_id"
      );
      const hotDeals = await Post.find({
        pincode: location.pincode,
      }).sort({ time: "desc" });
      res.send({ success: true, hotDeals: hotDeals });
    } catch (error) {
      res.send({ success: false, error: error.toStirng() });
    }
  }
});

router.get("/v/trending", async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const trending = await Post.find({
        time: { $gt: new Date().getTime() - 86400000 },
      }).sort({ likes: "desc" });
      res.send({ success: true, trending: trending });
    } catch (error) {
      res.send({ success: false, error: error.toStirng() });
    }
  }
});

router.get("/c/trending", async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const trending = await Post.find({
        time: { $gt: new Date().getTime() - 86400000 },
      }).sort({ likes: "desc" });
      res.send({ success: true, trending: trending });
    } catch (error) {
      res.send({ success: false, error: error.toStirng() });
    }
  }
});

module.exports = router;

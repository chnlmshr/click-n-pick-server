const authorizeVendor = require("../authorize/vendor"),
  authorizeCustomer = require("../authorize/customer"),
  router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer");

router.get("/customer", authorizeCustomer, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const customer = await Customer.findById(req.userid);
      res.send({ success: true, following: customer.following });
    } catch (error) {
      res.send({ success: false, err: "Something went wrong!" });
    }
  }
});

router.get("/vendor", authorizeVendor, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const vendor = await Vendor.findById(req.userid);
      res.send({
        success: true,
        followers: vendor.followers,
        following: vendor.following,
      });
    } catch (error) {
      console.log(error);
      res.send({ success: false, err: "Something went wrong!" });
    }
  }
});

router.post("/follow/c2v", authorizeCustomer, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      await Customer.findByIdAndUpdate(req.userid, {
        $addToSet: { following: req.body.vendor },
      });
      await Vendor.findByIdAndUpdate(req.body.vendor, {
        $addToSet: { followers: req.userid },
      });
      res.send({ success: true });
    } catch (error) {
      console.log(error);
      res.send({ success: false, err: "Something went wrong!" });
    }
  }
});

router.post("/follow/v2v", authorizeVendor, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      await Vendor.findByIdAndUpdate(req.userid, {
        $addToSet: { following: req.body.vendor },
      });
      await Vendor.findByIdAndUpdate(req.body.vendor, {
        $addToSet: { followers: req.userid },
      });
      res.send({ success: true });
    } catch (error) {
      console.log(error);
      res.send({ success: false, err: "Something went wrong!" });
    }
  }
});

module.exports = router;

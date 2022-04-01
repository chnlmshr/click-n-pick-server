const authorizeVendor = require("../authorize/vendor"),
  authorizeCustomer = require("../authorize/customer"),
  router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  Post = require("../models/Post");

router.post("/create", authorizeVendor, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      let post = await Post.create({
        productName: req.body.productName,
        availabilty: req.body.availabilty,
        description: req.body.description,
        vendor: req.userid,
        time: new Date(),
        price: req.body.price,
        images: req.body.images,
      });
      if (post) res.send({ success: true, post: post });
      else res.send({ success: true, err: "Post not created!" });
    } catch (error) {
      res.send({ success: false, err: error.toString() });
    }
  }
});

router.get("/vendor/feed/:skip", authorizeVendor, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const vendor = await Vendor.findById(req.userid);
      const posts = await Post.find(
        {
          shopkeeper: { $in: vendor.following },
        },
        undefined,
        { skip: req.params?.skip, limit: 10 }
      ).sort({ time: "desc" });
      res.send({ success: true, posts: posts });
    } catch (error) {
      res.send({ success: false, err: "Something went wrong!" });
    }
  }
});

router.get("/customer/feed/:skip", authorizeCustomer, async (req, res) => {
  if (!req.userid) return;
  else {
    try {
      const customer = await Customer.findById(req.userid);
      const posts = await Post.find(
        {
          shopkeeper: { $in: customer.following },
        },
        undefined,
        { skip: req.params?.skip, limit: 10 }
      ).sort({ time: "desc" });
      res.send({ success: true, posts: posts });
    } catch (error) {
      console.log(error);
      res.send({ success: false, err: "Something went wrong!" });
    }
  }
});

module.exports = router;

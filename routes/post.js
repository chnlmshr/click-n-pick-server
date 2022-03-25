const authorizeVendor = require("../authorize/vendor");

const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  Post = require("../models/Post");

router.post("/create", authorizeVendor, async (req, res) => {
  try {
    let post = await Post.create({
      productName: req.body.productName,
      availabilty: req.body.availabilty,
      description: req.body.description,
      shopkeeper: req.userid,
      time: new Date(),
      price: req.body.price,
      images: req.body.images,
    });
    if (post) res.send({ success: true, post: post });
    else res.send({ success: true, err: "Post not created!" });
  } catch (error) {
    res.send({ success: true, err: "Something went wrong!" });
  }
});

module.exports = router;

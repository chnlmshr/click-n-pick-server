const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcryptjs"),
  VENDOR = "VENDOR",
  CUSTOMER = "CUSTOMER";

router.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, salt);
    if (req?.body?.role === VENDOR) {
      const vendorExists = await Vendor.exists({
        $or: [{ username: req.body.username }, { phone: req.body.phone }],
      });
      if (vendorExists)
        res.send({ success: false, error: "Venor already exists!" });
      else {
        await Vendor.create({
          shopName: req.body.shopName,
          username: req.body.username,
          password: securePassword,
          phone: req.body.phone,
          location: {
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
          },
        });
        res.send({ success: true });
      }
    } else if (req?.body?.role === CUSTOMER) {
      const customer = await Customer.create({
        name: req.body.name,
        password: securePassword,
        phone: req.body.phone,
      });
      res.send({ success: true, user: customer });
    } else {
      res.send({ success: false, error: "Invalid Role" });
    }
  } catch (error) {
    res.send({ success: false, error: error.toString() });
  }
});

router.post("/login", (req, res) => {
  if (req?.body?.role === VENDOR) {
    Vendor.findOne({ phone: req?.body?.phone }, async (err, user) => {
      if (err) {
        console.log("##login/findOne/vendor##", err);
        res.send({ success: false, err: "Server Error!" });
      } else if (!user) {
        console.log("##login/findOne/vendor##", err);
        res.send({ success: false, err: "Invalid Credentials!" });
      } else {
        const passwordCompare = await bcrypt.compare(
          req?.body?.password,
          user.password
        );
        if (!passwordCompare) {
          return res.send({ success: false, err: "Invalid Credentials!" });
        } else {
          const authtoken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          res.send({ success: true, authtoken: authtoken });
        }
      }
    });
  } else if (req?.body?.role === CUSTOMER) {
    Customer.findOne({ phone: req?.body?.phone }, async (err, user) => {
      if (err) {
        console.log("##login/findOne/customer##", err);
        res.send({ success: false, err: "Server Error!" });
      } else if (!user) {
        console.log("##login/findOne/customer##", err);
        res.send({ success: false, err: "Invalid Credentials!" });
      } else {
        const passwordCompare = await bcrypt.compare(
          req?.body?.password,
          user.password
        );
        if (!passwordCompare) {
          return res.send({ success: false, err: "Invalid Credentials!" });
        } else {
          const authtoken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          res.send({ success: true, authtoken: authtoken });
        }
      }
    });
  } else {
    res.send({ success: false, err: "Invalid Role!" });
  }
});

module.exports = router;

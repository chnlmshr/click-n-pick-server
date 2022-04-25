const authorize = require("../authorize");

const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcryptjs"),
  { roles, rejectRequestWith, respondWith } = require("../logistics");

// Signing Up

router.post("/signup", async (req, res) => {
  try {
    const securePassword = await bcrypt.hash(req.body?.password, 8);

    if (req.body?.role === roles.VENDOR) {
      let vendorExists = await Vendor.exists({ username: req.body?.username });

      if (vendorExists) throw "Username already exists!";

      vendorExists = await Vendor.exists({ phone: req.body?.phone });

      if (vendorExists) throw "Phone already exists!";

      await Vendor.create({
        shopName: req.body?.shopName,
        username: req.body?.username,
        password: securePassword,
        phone: req.body?.phone,
        location: {
          city: req.body?.city,
          state: req.body?.state,
          pincode: req.body?.pincode,
        },
      });

      respondWith(res, "Vendor Created!");
    } else if (req?.body?.role === roles.CUSTOMER) {
      await Customer.create({
        name: req.body?.name,
        password: securePassword,
        phone: req.body?.phone,
        location: {
          city: req.body?.city,
          state: req.body?.state,
          pincode: req.body?.pincode,
        },
      });

      respondWith(res, "Customer Created!");
    } else throw "Invalid Role!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

// Logging In

router.post("/login", async (req, res) => {
  try {
    let user = false;
    if (req.body?.role === roles.VENDOR)
      user = await Vendor.findOne({ phone: req.body?.phone });
    else if (req.body?.role === roles.CUSTOMER)
      user = await Customer.findOne({ phone: req.body?.phone });
    if (user) {
      const correctPassword = await bcrypt.compare(
        req.body?.password,
        user.password
      );

      if (correctPassword) {
        const authtoken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        respondWith(res, authtoken);
      } else throw "Invalid Credentials";
    } else throw "Invalid Credentials";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/", authorize, async (req, res) => {
  try {
    respondWith(res, req.user);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/", authorize, async (req, res) => {
  try {
    const update = {
      location: {
        pincode: req.body?.location?.pincode?.length
          ? req.body?.location?.pincode
          : req.user?.location?.pincode,
        city: req.body?.location?.city?.length
          ? req.body?.location?.city
          : req.user?.location?.city,
        state: req.body?.location?.state?.length
          ? req.body?.location?.state
          : req.user?.location?.state,
      },
      profileImage: req.body?.profileImage,
      shopName: req.body?.shopName?.length
        ? req.body?.shopName
        : req.user?.shopName,
    };
    if (req.role === roles.VENDOR)
      await Vendor.findByIdAndUpdate(req.user._id, update);
    else await Customer.findByIdAndUpdate(req.user._id, update);
    respondWith(res, "User Info Updated!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/:role/:id", async (req, res) => {
  try {
    let user = false;
    if (req.params.role === roles.VENDOR)
      user = await Vendor.findById(req.params.id, { password: 0 });
    else user = await Customer.findById(req.params.id, { password: 0 });
    respondWith(res, user);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

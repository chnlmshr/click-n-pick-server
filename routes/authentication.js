const authorize = require("../authorize"),
  router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  { roles, rejectRequestWith, respondWith } = require("../logistics"),
  getId = require("./firebase"),
  jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const [token, role] = req.headers["authorization"].split(" ");
    const payload = await getId(token);

    console.log(payload);

    if (req.body?.role === roles.VENDOR) {
      let vendorExists = await Vendor.exists({ username: req.body?.username });

      if (vendorExists) throw "Username already exists!";

      vendorExists = await Vendor.exists({ phone: payload.phone_number });

      if (vendorExists) throw "Phone already exists!";

      await Vendor.create({
        _id: payload.uid,
        shopName: req.body?.shopName,
        username: req.body?.username,
        phone: payload.phone_number,
        location: {
          city: req.body?.city,
          state: req.body?.state,
          pincode: req.body?.pincode,
        },
      });
    } else if (req?.body?.role === roles.CUSTOMER) {
      await Customer.create({
        _id: payload.uid,
        name: req.body?.name,
        phone: payload.phone_number,
        location: {
          city: req.body?.city,
          state: req.body?.state,
          pincode: req.body?.pincode,
        },
      });
    } else throw "Invalid Role!";
    const authtoken = jwt.sign({ _id: payload.uid }, process.env.JWT_SECRET);
    respondWith(res, authtoken);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.post("/login", async (req, res) => {
  try {
    const [token, role] = req.headers["authorization"].split(" ");
    const payload = await getId(token);
    let exists = false;
    if (req.body?.role === roles.VENDOR)
      exists = await Vendor.exists({ phone: payload.phone_number });
    else if (req?.body?.role === roles.CUSTOMER)
      exists = await Customer.exists({ phone: payload.phone_number });
    else throw "Invalid Role!";
    if (exists) {
      const authtoken = jwt.sign({ _id: payload.uid }, process.env.JWT_SECRET);
      respondWith(res, authtoken);
    } else throw "User Unauthorized!";
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
    let securityAnswer = "";
    if (req.body?.securityAnswer)
      securityAnswer = await bcrypt.hash(req.body?.securityAnswer, 8);
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
      securityQuestion: req.body?.securityQuestion
        ? req.body?.securityQuestion
        : 0,
      securityAnswer: securityAnswer,
    };
    if (req.role === roles.VENDOR)
      await Vendor.findByIdAndUpdate(req.user._id, update);
    else await Customer.findByIdAndUpdate(req.user._id, update);
    respondWith(res, "User Info Updated!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.post("/validatesecurityquestion", async (req, res) => {
  try {
    let user = false;
    if (req.body?.role === roles.VENDOR)
      user = await Vendor.findOne({ phone: req.body?.phone });
    else if (req.body?.role === roles.CUSTOMER)
      user = await Customer.findOne({ phone: req.body?.phone });
    if (user) {
      const correctSecurityAnswer = await bcrypt.compare(
        req.body?.securityAnswer,
        user.securityAnswer
      );

      if (
        correctSecurityAnswer &&
        req.body?.securityQuestion == user.securityQuestion
      ) {
        respondWith(res, true);
      } else throw "Invalid Credentials";
    } else throw "Phone not registered!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.post("/passwordreset", async (req, res) => {
  try {
    let user = false;
    if (req.body?.role === roles.VENDOR)
      user = await Vendor.findOne({ phone: req.body?.phone });
    else if (req.body?.role === roles.CUSTOMER)
      user = await Customer.findOne({ phone: req.body?.phone });
    if (user) {
      const correctSecurityAnswer = await bcrypt.compare(
        req.body?.securityAnswer,
        user.securityAnswer
      );
      if (
        correctSecurityAnswer &&
        req.body?.securityQuestion == user.securityQuestion
      ) {
        const securePassword = await bcrypt.hash(req.body?.password, 8);
        if (req.body?.role === roles.VENDOR)
          Vendor.findByIdAndUpdate(user._id, { password: securePassword });
        else Customer.findByIdAndUpdate(user._id, { password: securePassword });
        respondWith(res, "Password Updated");
      } else throw "Invalid Credentials";
    } else throw "Phone not registered!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/:role/:id", async (req, res) => {
  try {
    let user = false;
    if (req.params.role === roles.VENDOR)
      user = await Vendor.findById(req.params.id, {
        password: 0,
        securityQuestion: 0,
        securityAnswer: 0,
      });
    else
      user = await Customer.findById(req.params.id, {
        password: 0,
        securityQuestion: 0,
        securityAnswer: 0,
      });
    respondWith(res, user);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

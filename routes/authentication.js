const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcryptjs"),
  VENDOR = "VENDOR",
  CUSTOMER = "CUSTOMER";

router.post("/signup", (req, res) => {
  Vendor.exists(
    { $or: [{ username: req.body.username }, { phone: req.body.phone }] },
    async (err, exists) => {
      if (err) {
        console.log("##signup/exists##", err);
        res.send({ success: false, err: "Server Error!" });
      } else if (exists)
        res.send({ success: false, err: "Credentials Already Exist!" });
      else {
        const salt = await bcrypt.genSalt(10);
        bcrypt.hash(req.body.password, salt, (err, securePassword) => {
          if (err) {
            console.log("##signup/hash##", err);
            res.send({ success: false, err: "Server Error!" });
          } else {
            if (req?.body?.role === VENDOR) {
              Vendor.create(
                {
                  shopName: req.body.shopName,
                  username: req.body.username,
                  password: securePassword,
                  phone: req.body.phone,
                  location: {
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.pincode,
                  },
                },
                (err, user) => {
                  if (err || !user) {
                    console.log("##signup/create/vendor##", err);
                    res.send({ success: false, err: "Server Error!" });
                  } else {
                    res.send({ success: true, user: user });
                  }
                }
              );
            } else if (req?.body?.role === CUSTOMER) {
              Customer.create(
                {
                  name: req.body.name,
                  password: securePassword,
                  phone: req.body.phone,
                },
                (err, user) => {
                  if (err || !user) {
                    console.log("##signup/create/cutomer##", err);
                    res.send({ success: false, err: "Server Error!" });
                  } else {
                    res.send({ success: true, user: user });
                  }
                }
              );
            } else {
              res.send({ success: false, err: "Invalid Role" });
            }
          }
        });
      }
    }
  );
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

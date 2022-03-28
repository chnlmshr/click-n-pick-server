const Vendor = require("../models/Vendor"),
  jwt = require("jsonwebtoken");

const authorizeVendor = (req, res, next) => {
  jwt.verify(
    req.headers["authorization"].split(" ")[0],
    process.env.JWT_SECRET,
    (err, payload) => {
      if (err) {
        res.send({ err: "Something went wrong while verifying token!" });
      } else if (payload) {
        Vendor.findById(payload._id, (err, user) => {
          if (err) {
            res.send({ err: "Something went wrong while finding User!" });
          } else if (
            user?.phone != req.headers["authorization"].split(" ")[1]
          ) {
            res.send({ err: "User Unauthorized!" });
          } else {
            req.userid = user._id;
            next();
          }
        });
      } else {
        res.send({ err: "User Unauthorized" });
      }
    }
  );
};

module.exports = authorizeVendor;

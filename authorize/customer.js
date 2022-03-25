const Customer = require("../models/Customer"),
  jwt = require("jsonwebtoken");

const authorizeCustomer = (req, res, next) => {
  jwt.verify(
    req.headers["authorization"].split(" ")[0],
    process.env.JWT_SECRET,
    (err, payload) => {
      if (err) {
        res.send({ err: "Something went wrong while verifying token!" });
      } else if (payload) {
        Customer.findById(payload._id, (err, user) => {
          if (err) {
            res.send({ err: "Something went wrong while finding User!" });
          } else if (
            user?.phone !== req.headers["authorization"].split(" ")[1]
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

module.exports = authorizeCustomer;

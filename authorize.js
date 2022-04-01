const Customer = require("./models/Customer"),
  Vendor = require("./models/Vendor"),
  jwt = require("jsonwebtoken"),
  { roles, rejectRequestWith } = require("./logistics");

module.exports = async (req, res, next) => {
  try {
    const [token, role] = req.headers["authorization"].split(" "),
      payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload) {
      let user = false;

      if (role === roles.VENDOR) user = await Vendor.findById(payload._id);
      else if (role === roles.CUSTOMER)
        user = await Customer.findById(payload._id);
      else throw "User Unauthorised!";

      if (user) {
        req.user = user;
        req.role = role;
        next();
      } else throw "User Unauthorised!";
    } else throw "User Unauthorised!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
};

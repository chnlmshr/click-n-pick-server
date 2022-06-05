const Customer = require("./models/Customer"),
  Vendor = require("./models/Vendor"),
  { roles, rejectRequestWith } = require("./logistics"),
  getId = require("./firebase");

module.exports = async (req, res, next) => {
  try {
    const [token, role] = req.headers["authorization"].split(" ");

    const payload = await getId(token);

    if (payload) {
      let user = false;

      if (role === roles.VENDOR)
        user = await Vendor.findById(payload.uid, { password: 0 });
      else if (role === roles.CUSTOMER)
        user = await Customer.findById(payload.uid, { password: 0 });
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

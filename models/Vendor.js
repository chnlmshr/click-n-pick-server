const mongoose = require("mongoose");

const VendorSchema = mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    pincode: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  followers: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
  following: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
});
module.exports = mongoose.model("Vendor", VendorSchema);

const mongoose = require("mongoose");

const VendorSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  shopName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
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
    type: String,
    unique: true,
  },
  followers: [
    {
      _id: false,
      connectionName: String,
      connectionId: String,
    },
  ],
  following: [
    {
      _id: false,
      connectionName: String,
      connectionId: String,
    },
  ],
});

module.exports = mongoose.model("Vendor", VendorSchema);

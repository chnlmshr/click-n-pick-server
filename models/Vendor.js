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
    type: Number,
    unique: true,
  },
  recoveryPhone: {
    type: Number,
    unique: true,
  },
  followers: [
    {
      _id: false,
      connectionName: String,
      connectionId: mongoose.Types.ObjectId,
    },
  ],
  following: [
    {
      _id: false,
      connectionName: String,
      connectionId: mongoose.Types.ObjectId,
    },
  ],
});

module.exports = mongoose.model("Vendor", VendorSchema);

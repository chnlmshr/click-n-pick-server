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
  // 0 => Doesn't exist; 1 => First Pay; 2 => Lucky Number; 3 => School Roll Number;
  securityQuestion: {
    type: Number,
    default: 0,
  },
  securityAnswer: {
    type: String,
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

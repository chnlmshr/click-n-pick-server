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
    required: true,
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

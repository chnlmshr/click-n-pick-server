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

VendorSchema.index({
  "location.state": "text",
  "location.pincode": "text",
  "location.city": "text",
  username: "text",
  shopName: "text",
});

module.exports = mongoose.model("Vendor", VendorSchema);

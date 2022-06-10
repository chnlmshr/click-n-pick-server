const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  recoveryPhone: {
    type: Number,
    unique: true,
  },
  profileImage: {
    type: String,
  },
  following: [
    {
      _id: false,
      connectionName: String,
      connectionId: mongoose.Types.ObjectId,
    },
  ],
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
});

module.exports = mongoose.model("Customer", CustomerSchema);

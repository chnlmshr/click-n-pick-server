const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  following: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
});
module.exports = mongoose.model("Customer", CustomerSchema);

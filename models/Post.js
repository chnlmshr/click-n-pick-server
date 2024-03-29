const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    ref: "Vendor",
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);

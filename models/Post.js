const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  vendor: {
    type: mongoose.Types.ObjectId,
    ref: "VendorSchema",
    required: true,
  },
  availabilty: {
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
  likes: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
  images: {
    type: [String],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
});

module.exports = mongoose.model("Post", PostSchema);

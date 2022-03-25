const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  shopkeeper: {
    type: mongoose.Types.ObjectId,
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
  images: [{ type: String }],
});

module.exports = mongoose.model("Post", PostSchema);

const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);

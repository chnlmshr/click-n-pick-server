const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

ReviewSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);

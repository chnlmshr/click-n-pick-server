const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  from: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
  },
});

module.exports = mongoose.model("Message", MessageSchema);

const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  vendor: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  customer: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);

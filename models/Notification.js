const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  fromConnectionId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  fromConnectionName: {
    type: String,
    required: true,
  },
  toConnection: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  onPost: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);

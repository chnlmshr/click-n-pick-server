const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  fromConnectionId: {
    type: String,
    required: true,
  },
  fromConnectionName: {
    type: String,
    required: true,
  },
  toConnection: {
    type: String,
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

const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  Notification = require("../models/Notification"),
  authorize = require("../authorize"),
  { respondWith, rejectRequestWith } = require("../logistics");

router.get("/", authorize, async (req, res) => {
  try {
    const notifications = await Notification.find({
      toConnection: req.user._id,
    });
    respondWith(res, notifications);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.post("/", authorize, async (req, res) => {
  try {
    await Notification.updateMany(
      { toConnection: req.user._id, seen: false },
      { seen: true }
    );
    respondWith(res, "Notifications Seen!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

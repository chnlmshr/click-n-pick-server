const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  authorize = require("../authorize"),
  { respondWith, rejectRequestWith, roles } = require("../logistics");

router.get("/:role/:id", async (req, res) => {
  try {
    let user = false;
    if (req.params.role === roles.VENDOR)
      user = await Vendor.findById(req.params.id);
    else user = await Customer.findById(req.params.id);
    respondWith(res, {
      following: user?.following,
      followers: user?.followers,
    });
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/follow", authorize, async (req, res) => {
  try {
    const connection = {
      followers: {
        connectionId: req.user?._id,
        connectionName: req.user?.username || req.user?.name,
      },
      following: {
        connectionId: req.body?.connectionId,
        connectionName: req.body?.connectionName,
      },
    };

    await Vendor.findByIdAndUpdate(connection.following.connectionId, {
      $addToSet: {
        followers: connection.followers,
      },
    });

    if (req.role === roles.VENDOR)
      await Vendor.findByIdAndUpdate(connection.followers.connectionId, {
        $addToSet: {
          following: connection.following,
        },
      });
    else
      await Customer.findByIdAndUpdate(connection.followers.connectionId, {
        $addToSet: {
          following: connection.following,
        },
      });
    respondWith(res, "Connection Established!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/unfollow", authorize, async (req, res) => {
  try {
    const connection = {
      followers: {
        connectionId: req.user?._id,
        connectionName: req.user?.username || req.user?.name,
      },
      following: {
        connectionId: req.body?.connectionId,
        connectionName: req.body?.connectionName,
      },
    };

    await Vendor.findByIdAndUpdate(connection.following.connectionId, {
      $pull: {
        followers: connection.followers,
      },
    });

    if (req.role === roles.VENDOR)
      await Vendor.findByIdAndUpdate(connection.followers.connectionId, {
        $pull: {
          following: connection.following,
        },
      });
    else
      await Customer.findByIdAndUpdate(connection.followers.connectionId, {
        $pull: {
          following: connection.following,
        },
      });
    respondWith(res, "Connection Dropped!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

const Notification = require("../models/Notification");

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

    await Notification.create({
      fromConnectionId: connection.followers.connectionId,
      fromConnectionName: connection.followers.connectionName,
      toConnection: connection.following.connectionId,
      action: "follow",
    });

    respondWith(res, "Connection Established and notification sent!");
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

    const vendor = await Vendor.findById(connection.following.connectionId);

    const followers = vendor.followers?.filter(
      (follower) => follower.connectionId.toString() != req.user?._id.toString()
    );

    await Vendor.findByIdAndUpdate(connection.following.connectionId, {
      followers: followers,
    });

    const followings = req.user?.following.filter(
      (following) =>
        following.connectionId.toString() !=
        connection.following.connectionId.toString()
    );

    if (req.role === roles.VENDOR)
      await Vendor.findByIdAndUpdate(connection.followers.connectionId, {
        following: followings,
      });
    else
      await Customer.findByIdAndUpdate(connection.followers.connectionId, {
        following: followings,
      });
    respondWith(res, "Connection Dropped!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/remove", authorize, async (req, res) => {
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

    const followers = req.user?.followers?.filter(
      (follower) =>
        follower.connectionId.toString() != req.body?.connectionId.toString()
    );

    await Vendor.findByIdAndUpdate(connection.followers.connectionId, {
      followers: followers,
    });

    if (req.role === roles.VENDOR) {
      const vendor = await Vendor.findById(connection.following.connectionId);

      const followings = vendor.following?.filter(
        (following) =>
          following.connectionId.toString() != req.user._id.toString()
      );

      await Vendor.findByIdAndUpdate(connection.following.connectionId, {
        following: followings,
      });
    } else {
      const customer = await Customer.findById(
        connection.following.connectionId
      );

      const followings = customer.followings?.filter(
        (following) =>
          following.connectionId.toString() != req.user._id.toString()
      );
      await Customer.findByIdAndUpdate(connection.following.connectionId, {
        $pull: {
          following: followings,
        },
      });
    }
    respondWith(res, "Connection Removed!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

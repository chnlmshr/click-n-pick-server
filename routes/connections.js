const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  authorize = require("../authorize"),
  { respondWith, rejectRequestWith, roles } = require("../logistics");

router.get("/", authorize, async (req, res) => {
  try {
    if (req.user)
      respondWith(res, {
        following: user.following,
        followers: user.followers,
      });
    else throw "Can't fetch connections at the moment!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/follow", authorize, async (req, res) => {
  try {
    if (req.user) {
      const connection = {
        followers: {
          connectionId: req.user?._id,
          connectionName: req.user?.usernname,
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
    } else throw "Can't establish connection at the moment!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/unfollow", authorize, async (req, res) => {
  try {
    if (req.user) {
      const connection = {
        followers: {
          connectionId: req.user?._id,
          connectionName: req.user?.usernname,
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
    } else throw "Can't drop connection at the moment!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

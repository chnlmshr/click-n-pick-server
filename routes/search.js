const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  { rejectRequestWith, respondWith } = require("../logistics");

router.get("/searchterm/:searchterm", async (req, res) => {
  try {
    const usernameAgg = [
        {
          $search: {
            autocomplete: { query: req.params.searchterm, path: "username" },
          },
        },
        { $project: { _id: 1, username: 1, location: 1, shopName: 1 } },
      ],
      shopNameAgg = [
        {
          $search: {
            autocomplete: { query: req.params.searchterm, path: "shopName" },
          },
        },
        { $project: { _id: 1, username: 1, location: 1, shopName: 1 } },
      ];

    const [usernames, shopNames] = await Promise.all([
      Vendor.aggregate(usernameAgg),
      Vendor.aggregate(shopNameAgg),
    ]);
    respondWith(res, { usernames, shopNames });
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/pincode/:pincode", async (req, res) => {
  try {
    const vendors = await Vendor.find({
      "location.pincode": req.params.pincode,
    }).select("username location shopName");
    respondWith(res, vendors);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

const router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  { rejectRequestWith, respondWith } = require("../logistics");

router.get("/:searchterm", async (req, res) => {
  try {
    const usernameAgg = [
        {
          $search: {
            autocomplete: { query: req.params.searchterm, path: "username" },
          },
        },
        { $project: { _id: 1, username: 1, location: 1, shopName: 1 } },
      ],
      pincodeAgg = [
        {
          $search: {
            autocomplete: {
              query: req.params.searchterm,
              path: "location.pincode",
            },
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

    const [usernames, pincodes, shopNames] = await Promise.all([
      Vendor.aggregate(usernameAgg),
      Vendor.aggregate(pincodeAgg),
      Vendor.aggregate(shopNameAgg),
    ]);
    respondWith(res, { usernames, pincodes, shopNames });
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

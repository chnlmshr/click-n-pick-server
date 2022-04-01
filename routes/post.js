const router = require("express").Router(),
  Post = require("../models/Post"),
  { rejectRequestWith, respondWith } = require("../logistics");

router.post("/create", authorize, async (req, res) => {
  try {
    if (req.user) {
      await Post.create({
        productName: req.body.productName,
        availabilty: req.body.availabilty,
        description: req.body.description,
        vendor: req.user._id,
        time: new Date(),
        price: req.body.price,
        images: req.body.images,
      });
      respondWith(res, "Post Created!");
    } else throw "User Unauthorised!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/feed/:skip", authorize, async (req, res) => {
  try {
    if (req.user) {
      const posts = await Post.find(
        {
          shopkeeper: { $in: req.user.following },
        },
        undefined,
        { skip: req.params?.skip, limit: 10 }
      ).sort({ time: "desc" });
      respondWith(res, posts);
    } else throw "User Unauthorised!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/like", authorize, async (req, res) => {
  try {
    if (req.user) {
      await Post.findByIdAndUpdate(req.body.postId, {
        $addToSet: {
          likes: req.user._id,
        },
      });
      respondWith(res, "Post Liked!");
    } else throw "User Unauthorised!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/unlike", authorize, async (req, res) => {
  try {
    if (req.user) {
      await Post.findByIdAndUpdate(req.body.postId, {
        $pull: {
          likes: req.user._id,
        },
      });
      respondWith(res, "Post Unliked!");
    } else throw "User Unauthorised!";
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

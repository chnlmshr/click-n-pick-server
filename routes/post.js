const router = require("express").Router(),
  Post = require("../models/Post"),
  Review = require("../models/Review"),
  { rejectRequestWith, respondWith } = require("../logistics"),
  authorize = require("../authorize");

router.post("/create", authorize, async (req, res) => {
  try {
    await Post.create({
      productName: req.body?.productName,
      availabilty: req.body?.availabilty,
      description: req.body?.description,
      vendor: req.user?._id,
      time: new Date(),
      price: req.body?.price,
      images: req.body?.images,
    });
    respondWith(res, "Post Created!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.get("/feed/:skip", authorize, async (req, res) => {
  try {
    const posts = await Post.find(
      {
        shopkeeper: { $in: req.user?.following },
      },
      undefined,
      { skip: req.params?.skip, limit: 10 }
    ).sort({ time: "desc" });
    respondWith(res, posts);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/like", authorize, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.body?.postId, {
      $inc: { likes: 1 },
    });
    await Review.create({
      postId: req.body?.postId,
      userId: req.user?._id,
    });
    respondWith(res, "Post Liked!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

router.put("/unlike", authorize, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.body?.postId, {
      $inc: { likes: -1 },
    });
    await Review.findOneAndDelete({
      userId: req.user?._id,
      postId: req.body?.postId,
    });
    respondWith(res, "Post Unliked!");
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

module.exports = router;

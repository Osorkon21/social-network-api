const router = require('express').Router();
const { Thought, User } = require("../../models/index");

// POST /:userId/friends/:friendId (another userId)

// PUT /:userId

// DELETE /:userId
// DELETE /:userId/friends/:friendId (another userId)

// get all Users
router.get("/", async (req, res) => {
  try {
    const result = await User.find()
      .select("-__v")
      .populate([
        { path: "thoughts", select: "_id" },
        { path: "friends", select: "_id" }
      ]);

    res.json({ status: "success", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// get a User
router.get("/:userId", async (req, res) => {
  try {
    const result = await User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate([
        { path: "thoughts", select: "-__v" },
        { path: "friends", select: "-__v" }
      ]);

    res.json({ status: "success", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// create new User
router.post("/", async (req, res) => {
  try {
    const result = await User.create(req.body);

    res.json({ status: "success", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

module.exports = router;

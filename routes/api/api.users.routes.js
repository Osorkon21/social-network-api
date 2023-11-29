const router = require('express').Router();
const { Thought, User } = require("../../models/index");

// get all Users
router.get("/", async (req, res) => {
  try {
    const result = await User.find()

      // do not include __v field in the query results
      .select("-__v");

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

      // do not include __v field in the query results
      .select("-__v")

      // add thoughts and friends associated with this User to query results, without their __v fields
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

// modify existing User
router.put("/:userId", async (req, res) => {
  try {

    // find and update User
    const result = await User.findOneAndUpdate(

      // find User with this filter
      {
        _id: req.params.userId
      },

      // update found User with incoming info
      req.body,

      // "result" is now the User after update runs
      {
        new: true
      }
    );

    res.json({ status: "success", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// delete existing User
router.delete("/:userId", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.userId);

    // delete User's Thoughts when User deleted
    for (var i = 0; i < result.thoughts.length; i++)
      await Thought.findByIdAndDelete(result.thoughts[i]);

    res.json({ status: "User and all thoughts deleted!", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// add friend to User's friends list
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      {
        // find User
        _id: req.params.userId
      },
      {
        // add new friend to User's friends array
        $push: { friends: req.params.friendId }
      },
      {
        new: true
      }
    );

    res.json({ status: "success", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// remove friend from User's friends list
router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      {
        // find User
        _id: req.params.userId
      },
      {
        // remove friend from User's friends array
        $pull: { friends: req.params.friendId }
      },
      {
        new: true
      }
    );

    res.json({ status: "delete successful", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

module.exports = router;

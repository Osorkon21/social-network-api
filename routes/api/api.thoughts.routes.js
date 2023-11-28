const router = require('express').Router();
const { Thought, User } = require("../../models/index");

// POST /:thoughtId/reactions

// DELETE /:thoughtId
// DELETE /:thoughtId/reactions/:reactionId

// get all Thoughts
router.get("/", async (req, res) => {
  try {
    const result = await Thought.find()
      .select("-__v");

    res.json({ status: "success", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// get a Thought
router.get("/:thoughtId", async (req, res) => {
  try {
    const result = await Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v");

    res.json({ status: "success", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// create new Thought
router.post("/", async (req, res) => {
  try {
    const result = await Thought.create(
      {
        thoughtText: req.body.thoughtText,
        username: req.body.username
      }
    );

    // find User who created Thought
    await User.findOneAndUpdate(
      {
        _id: req.body.userId
      },
      {
        // push new Thought _id to User's thoughts array
        $push: { thoughts: result._id }
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

// modify existing Thought
router.put("/:thoughtId", async (req, res) => {
  try {

    // find and update Thought
    const result = await Thought.findOneAndUpdate(

      // find Thought with this filter
      {
        _id: req.params.thoughtId
      },

      // update found Thought with incoming info
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

    res.json({ status: "delete successful", result });
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

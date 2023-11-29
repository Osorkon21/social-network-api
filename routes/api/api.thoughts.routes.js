const router = require('express').Router();
const { Thought, User } = require("../../models/index");

// get all Thoughts
router.get("/", async (req, res) => {
  try {
    const result = await Thought.find()

      // do not include __v field in the query results
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

      // do not include __v field in the query results
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

    await User.findOneAndUpdate(
      {
        // find User who created Thought
        _id: req.body.userId
      },
      {
        // push new Thought _id to User's thoughts array
        $push: { thoughts: result._id }
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
      {
        thoughtText: req.body.thoughtText
      },

      // "result" is now the Thought after update runs
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

// delete existing Thought
router.delete("/:thoughtId", async (req, res) => {
  try {
    const result = await Thought.findByIdAndDelete(req.params.thoughtId);

    // find User who created Thought
    await User.findOneAndUpdate(
      {
        username: result.username
      },
      {
        // remove Thought _id from User's thoughts array
        $pull: { thoughts: result._id }
      }
    );

    res.json({ status: "delete successful", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// add reaction to Thought
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const result = await Thought.findOneAndUpdate(
      {
        // find Thought
        _id: req.params.thoughtId
      },
      {
        // add new reaction to Thought's reactions array
        $push: { reactions: req.body }
      },
      {
        // "result" is now the Thought after update runs
        new: true
      }
    );

    // verifies req.body is a valid reaction
    await result.save();

    res.json({ status: "success", result });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", result: err.message });
  }
});

// remove reaction from Thought
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const result = await Thought.findOneAndUpdate(
      {
        // find Thought
        _id: req.params.thoughtId
      },
      {
        // remove reaction from Thought's reactions array
        $pull: { reactions: { reactionId: req.params.reactionId } }
      },
      {
        // "result" is now the Thought after update runs
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

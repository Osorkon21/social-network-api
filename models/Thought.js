// import Mongoose
const { Types, Schema, model } = require('mongoose');

// format timestamp to something more readable
function formatTimeStamp(val) {
  return val.toLocaleString();
}

// set up reactionSchema subdocument
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,

      // sets error message to return if reactionBody is null
      required: [true, "No reactionBody supplied"],

      // sets error message to return if reactionBody is longer than 280 characters
      maxLength: [280, "reactionBody supplied contained more than 280 characters."]
    },
    username: {
      type: String,

      // sets error message to return if username is null
      required: [true, "No username supplied"]
    },
    createdAt: {
      type: Date,
      default: Date.now,

      // all createdAt get query results will be formatted by this function first
      get: formatTimeStamp
    }
  },
  {
    // when sending anything as JSON, include the getters
    toJSON: {
      getters: true,
    },

    // don't include a default getter for the _id property
    id: false
  }
)

// set up Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,

      // sets error message to return if thoughtText is null
      required: [true, "No thoughtText supplied"],

      // sets error message to return if thoughtText is an empty string
      minLength: [1, "thoughtText supplied was an empty string."],

      // sets error message to return if thoughtText is longer than 280 characters
      maxLength: [280, "thoughtText supplied contained more than 280 characters."]
    },
    createdAt: {
      type: Date,
      default: Date.now,

      // all createdAt get query results will be formatted by this function first
      get: formatTimeStamp
    },
    username: {
      type: String,

      // sets error message to return if username is null
      required: [true, "No username supplied"],
    },
    reactions: [reactionSchema]
  },
  {
    // when sending anything as JSON, include the getters and virtuals
    toJSON: {
      getters: true,
      virtuals: true,
    },

    // don't include a default getter for the _id property
    id: false
  }
);

// Create a virtual property `reactionCount` that gets the amount of reactions the Thought has
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Initialize Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;

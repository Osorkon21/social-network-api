// import Mongoose
const { model, Schema } = require('mongoose');

// set up reactionSchema subdocument
const reactionSchema = new Schema(
  {

  }
)

// set up Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,

      // sets error message to return if thoughtText is null
      required: [true, "no Thought thoughtText supplied at {PATH}"],

      // sets error message to return if thoughtText is an empty string
      minLength: [1, "Thought thoughtText supplied at {PATH} was an empty string."],

      // sets error message to return if thoughtText is longer than 280 characters
      maxLength: [280, "Thought thoughtText supplied at {PATH} contained more than 280 characters."]
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function (val) {
        return val.toLocaleString();
      }
    },
    username: {
      type: String,

      // sets error message to return if username is null
      required: [true, "no Thought username supplied at {PATH}"],
    },
    reactions: [reactionSchema]
  },
  {
    // when sending anything as JSON, include the getters and virtuals
    // toJSON: {
    //   getters: true,
    //   virtuals: true,
    // },
  }
);

// Create a virtual property `reactionCount` that gets the amount of reactions the Thought has
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Initialize Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;

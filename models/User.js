// import Mongoose
const { model, Schema } = require('mongoose');

// needed for email validation
const validator = require("validator");

// set up User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,

      // sets error message to return if username is null
      required: [true, "No User username supplied at {PATH}"],

      trim: true
    },
    email: {
      type: String,

      // sets error message to return if email is null
      required: [true, "No User email supplied at {PATH}"],

      unique: true,
      validate: {

        // refuses to create User if supplied value is not a valid email address
        validator: function (v) {
          return validator.isEmail(v);
        },

        // error message returned if validation fails
        message: "User email {VALUE} supplied at {PATH} was not a valid email address!"
      }
    },
    // references Thought model _id values
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought"
      }
    ],
    // self-references User model _id values
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    // when sending anything as JSON, include the virtuals
    toJSON: {
      virtuals: true,
    },
    id: false
  }
);

// Create a virtual property `friendCount` that gets the amount of friends User has
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Initialize User model
const User = model('User', userSchema);

module.exports = User;

const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required']
      // unique: true -> Ideally, should be unique, but its up to you
    },
  

    email: {
      type: String, 
      required: [true, 'Email is required.'],
      unique: true, 
      trim: true
    },

    passwordHash: {
      type: String,
      require: [true, 'Password is required.']
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      default: null
    }
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

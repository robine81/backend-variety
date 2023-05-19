const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    password: {
        type: String,
        required: true,
      },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: String,
    lastName: String,
  }
);

const User = model("User", userSchema);

module.exports = User;
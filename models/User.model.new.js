const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // adjust path to your Sequelize instance

const User = sequelize.define("User", {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "users",
  timestamps: false, // change to true if you want createdAt / updatedAt
});

module.exports = User;
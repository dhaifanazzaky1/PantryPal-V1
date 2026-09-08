"use strict";
const { Model } = require("sequelize");
const { hashPW } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.SavedRecipe, { foreignKey: "userId" });
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "email is required" },
          notEmpty: { msg: "email is required" },
          isEmail: { msg: "Invalid email format" },
        },
      },
      username: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          minLength(value) {
            if (value.length < 8) {
              throw new Error("min password is 8");
            }
          },
          notNull: { msg: "password is required" },
          notEmpty: { msg: "password is required" },
        },
      },
      avatarUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    },
  );

  User.beforeCreate((x) => {
    x.password = hashPW(x.password)
  })
  return User;
};

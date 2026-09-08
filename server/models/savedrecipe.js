'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavedRecipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SavedRecipe.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  SavedRecipe.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    spoonacularId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SavedRecipe',
  });
  return SavedRecipe;
};
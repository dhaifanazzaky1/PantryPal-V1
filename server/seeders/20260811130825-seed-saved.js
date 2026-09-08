"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/savedRecipes.json");
    data.forEach((el) => {
      delete el.id,el.aiData,el.source,el.notes;
      el.createdAt = el.updatedAt = new Date();
     
    });
    await queryInterface.bulkInsert("SavedRecipes", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SavedRecipes", null, {
      restartIdentity: true,
      cascade: true,
      truncate: true,
    });
  },
};

'use strict';

const { hashPW } = require('../helpers/bcrypt');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const data = require('../data/users.json')
   data.forEach((el) => {
    delete el.id
    el.password = hashPW(el.password);
    el.createdAt = el.updatedAt = new Date()
   })
    await queryInterface.bulkInsert('Users', data , {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {restartIdentity:true, cascade : true, truncate:true});
  }
};

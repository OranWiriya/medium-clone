'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('favorites', 'createdAt');
    await queryInterface.removeColumn('favorites', 'updatedAt');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};

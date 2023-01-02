'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Medicines', {
      medicineId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      itemName: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      entpName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      etcOtcCode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      chart: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      changeDate: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      materialName: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
      },
      validTerm: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      eeDocData: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      udDocData: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      nbDocData: {
        type: Sequelize.DataTypes.JSON,
        allowNull: true,
      },
      ingrName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      itemImage: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Medicines');
  },
};

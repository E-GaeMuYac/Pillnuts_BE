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
      itemSeq: {
        type: Sequelize.DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      itemName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      entpName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      itemImage: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      etcOtcCode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      productType: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      materialName: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
      },
      ingrName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      validTerm: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      eeDocData: {
        type: Sequelize.DataTypes.STRING(3000),
        allowNull: true,
      },
      udDocData: {
        type: Sequelize.DataTypes.STRING(3000),
        allowNull: true,
      },
      nbDocData: {
        type: Sequelize.DataTypes.STRING(100000),
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

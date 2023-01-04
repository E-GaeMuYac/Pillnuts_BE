'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medicines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.SavedMedicines, {
        as: 'SavedMedicines',
        foreignKey: 'medicineId',
      });
    }
  }
  Medicines.init(
    {
      medicineId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      itemSeq: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      itemName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      entpName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      etcOtcCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      productType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      materialName: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      ingrName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      validTerm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      eeDocData: {
        type: DataTypes.STRING(100000),
        allowNull: true,
      },
      udDocData: {
        type: DataTypes.STRING(100000),
        allowNull: true,
      },
      nbDocData: {
        type: DataTypes.JSON(1000000),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Medicines',
    }
  );
  return Medicines;
};

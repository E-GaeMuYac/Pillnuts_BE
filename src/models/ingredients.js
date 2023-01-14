'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Materials, { foreignKey: 'materialId' });
      this.belongsTo(models.Medicines, { foreignKey: 'medicineId' });
    }
  }
  Ingredients.init(
    {
      ingredientId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Materials',
          key: 'materialId',
        },
        onDelete: 'cascade',
      },
      medicineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Medicines',
          key: 'medicineId',
        },
        onDelete: 'cascade',
      },
      volume: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 5),
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
      modelName: 'Ingredients',
    }
  );
  return Ingredients;
};

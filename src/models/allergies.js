'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allergies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Materials, { foreignKey: 'materialId' });
      this.belongsTo(models.Users, { foreignKey: 'userId' });
    }
  }
  Allergies.init(
    {
      allergyId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'UserId',
        },
        onDelete: 'cascade',
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
      modelName: 'Allergies',
    }
  );
  return Allergies;
};

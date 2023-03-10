'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, { foreignKey: 'userId' });
      this.belongsTo(models.Medicines, { foreignKey: 'medicineId' });
      this.hasMany(models.Likes, {
        as: 'Likes',
        foreignKey: 'reviewId',
      });
      this.hasMany(models.Dislikes, {
        as: 'Dislikes',
        foreignKey: 'reviewId',
      });
    }
  }
  Reviews.init(
    {
      reviewId: {
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
          key: 'userId',
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
      review: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
      report: {
        allowNull: true,
        type: DataTypes.STRING,
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
      modelName: 'Reviews',
    }
  );
  return Reviews;
};

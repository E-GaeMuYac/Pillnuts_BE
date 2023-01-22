const { Reviews } = require('../../models');
const { Products } = require('../../models');
const { Users } = require('../../models');

class ReviewRepository {
  createReview = async (medicineId, userId, review) => {

    const createReview = await Reviews.create({ medicineId, userId, review })
      return createReview.dataValues.reviewId;
    };
  
  findOneMedicine = async (medicineId) => {
    return Products.findOne({
      where: {
        medicineId,
      },
      include: {
        model: Users,
        attributes: ['nickname'],
      },
    });
  };
  
  createReview = async (medicineId, userId, review) => {

  const createReview = await Reviews.create({ medicineId, userId, review })
    return createReview.dataValues.reviewId;
  };
  
}

module.exports = ReviewRepository;

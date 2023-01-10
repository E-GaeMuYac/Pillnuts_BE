const { Posts } = require('../../models');
const Sequelize = require('sequelize');

class PostsRepository {
  createPost = async (post) => {
    await Posts.create({ post });
  };

  findPost = async () => {
    return Posts.findOne({
      order: [Sequelize.literal('RAND()')],
    });
  };
}

module.exports = PostsRepository;

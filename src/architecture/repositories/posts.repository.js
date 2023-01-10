const { Posts } = require('../../models');

class PostsRepository {
  createPost = async (post) => {
    await Posts.create({ post });
  };
}

module.exports = PostsRepository;

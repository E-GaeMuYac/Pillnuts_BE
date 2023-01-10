const PostsRepository = require('../repositories/posts.repository');

class PostsService {
  constructor() {
    this.postsRepository = new PostsRepository();
  }

  createPost = async (content) => {
    await this.postsRepository.createPost(content);
  };

  findPost = async () => {};
}

module.exports = PostsService;

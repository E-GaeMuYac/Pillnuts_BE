const PostsRepository = require('../repositories/posts.repository');

class PostsService {
  constructor() {
    this.postsRepository = new PostsRepository();
  }

  createPost = async (content) => {
    await this.postsRepository.createPost(content);
  };

  findPost = async () => {
    const post = await this.postsRepository.findPost();
    if (!post) {
      throw new Error('글 조회에 실패하였습니다.');
    }
    return post;
  };
}

module.exports = PostsService;

const PostsService = require('../services/posts.service');

class PostsController {
  constructor() {
    this.postsService = new PostsService();
  }

  createPost = async (req, res, next) => {
    try {
      const { content } = req.body;

      await this.postsService.createPost(content);
      return res
        .status(201)
        .json({ message: '성공적으로 글이 저장되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
  findPost = async (req, res, next) => {
    try {
      const { post } = await this.postsService.findPost();
      return res.status(200).json({ post });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PostsController;

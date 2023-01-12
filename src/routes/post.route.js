const express = require('express');
const router = express.Router();
const PostsController = require('../architecture/controllers/posts.controller');
const postsController = new PostsController();

router.post('/', postsController.createPost);
router.get('/', postsController.findPost);

module.exports = router;

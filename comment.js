// Create web server with express
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');
const { validateComment } = require('../utils/validateComment');
const { validatePost } = require('../utils/validatePost');

// Create new comment
router.post('/posts/:postId/comments', isLoggedIn, validateComment, async (req, res) => {
	try {
		const post = await Post.findById(req.params.postId);
		if (!post) {
			return res.status(404).json({ error: 'Post not found' });
		}
		const comment = await Comment.create({
			text: req.body.text,
            			user: req.user._id,
			post: post._id
		});			
		post.comments.push(comment);
		await post.save();
		const populatedComment = await comment.populate('user').execPopulate();
		return res.status(201).json(populatedComment);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Something went wrong' });
	}
});

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const verifyToken = require('../middleware/verify-token');
const comment = require('../models/comment');

router.post('/', verifyToken, async (req, res) => {
    try {
        const {newsFeed, user, content} = req.body;
        const newComment = new Comment({ newsFeed, user, content });
        await newComment.save();
        res.status(201).json(newComment)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:newsFeedId', async (req, res) => {
    try {
        const comments = await Comment.find({ newsFeed: req.params.newsFeedId }).populate('user')
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
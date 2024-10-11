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

router.put('/:id', async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/id', async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(204).send()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;
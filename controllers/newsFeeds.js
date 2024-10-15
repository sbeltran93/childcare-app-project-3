const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const NewsFeed = require('../models/newsFeed');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token');

// route to make post
router.post('/', verifyToken, async (req, res) => {
    try {
        const {content} = req.body;
        const caregiver = req.user._id;
        const newFeed = new NewsFeed({caregiver, content });
        await newFeed.save();
        res.status(201).json(newFeed);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});
router.get('/', verifyToken, async (req, res) => {
    try {
        const newsFeed = await NewsFeed.find({ caregiver: req.user._id });
        res.status(200).json(newsFeed);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/:userId', async (req, res) => {
    try {
        const feeds = await NewsFeed.find({ caregiver: req.params.user._id }).populate('caregiver');
        res.status(200).json(feeds)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})
router.put('/:id', async (req, res) => {
    try {
        const updatedFeed = await NewsFeed.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updatedFeed) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(updatedFeed);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const deletedFeed = await NewsFeed.findByIdAndDelete(req.params.id);
        if (!deletedFeed) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(204).send()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;
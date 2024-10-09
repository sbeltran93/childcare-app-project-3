const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const NewsFeed = require('../models/newsFeed');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token');


router.post('/', verifyToken, async (req, res) => {
    try {
        const {child, caregiver, content} = req.body;
        const newFeed = new NewsFeed({ child, caregiver, content });
        await newFeed.save();
        res.status(201).json(newfeed);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.get('/:chiidId', async (req, res) => {
    try {
        const feeds = await NewsFeed.find({ child: req.params.chiidId }).populate('caregiver');
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

router.delete('/id', async (req, res) => {
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
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const NewsFeed = require('../models/newsFeed');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token');
const verifyOwnership = require('../middleware/verifyOwnership');
const verifyRole = require('../middleware/verifyRole');

// route to make post, only caregiver is authorized 
router.post('/', verifyToken, verifyRole('Caregiver'), async (req, res) => {
    const {content, childId } = req.body;
    const caregiver = req.user._id;

    try {
        if (!childId) {
            return res.status(400).json({ error: 'Child ID is required.' })
        }

        const newFeed = new NewsFeed({
            caregiver: caregiver, 
            content: content,
            child: childId,
         });
        await newFeed.save();
        res.status(201).json(newFeed);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});
    //parent newsfeed route
router.get('/', verifyToken, verifyRole('Parent'),  async (req, res) => {
    const parentId = req.user._id;

    try {
        //children associated with parent
        const children = await Child.find({ parents: parentId }).select('_id');
        //extracting child id to use in the query
        const childIds = children.map(child => child._id);
        //fetch newsfeed related to child
        const newsFeed = await NewsFeed.find({ child: { $in: childIds } })
            .populate('caregiver', 'username')
            .populate('child', 'name')
            .sort({ timestamp: -1 });
        res.status(200).json(newsFeed) 
   
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});
/*
router.get('/:userId', async (req, res) => {
    try {
        const feeds = await NewsFeed.find({ caregiver: req.params.user._id }).populate('caregiver');
        res.status(200).json(feeds)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})
    */

//Update feed, caregiver only
router.put('/:id', verifyToken, verifyRole('Caregiver'), async (req, res) => {
    try {
        const updatedFeed = await NewsFeed.findById(req.params.id);
        if (!updatedFeed) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (updatedFeed.caregiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to edit this post' })
        }
        const updatedPost = await NewsFeed.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
//delete route, caregiver only
router.delete('/:id', verifyToken, verifyRole('Caregiver'), async (req, res) => {
    try {
        const deletedFeed = await NewsFeed.findById(req.params.id);
        if (!deletedFeed) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (deletedFeed.caregiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this post.' })
        }
        await NewsFeed.findByIdAndDelete(req.params.id);
        res.status(204).send()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;
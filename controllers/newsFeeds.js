const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const NewsFeed = require('../models/newsFeed');
const Child = require('../models/child');
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token');
const verifyOwnership = require('../middleware/verifyOwnership');
const verifyRole = require('../middleware/verifyRole');

// route to make post, only caregiver is authorized 
router.post('/', verifyToken, verifyRole('Caregiver'), async (req, res) => {
    console.log('Request body received:', req.body);
    const {title, content, child: childId } = req.body;
    const caregiver = req.user._id;

    try {

        if (!content || !childId) {
            console.error('Missing content or childId');
            return res.status(400).json({ error: 'Content and child is required.' })
        }

        const child = await Child.findById(childId)
        console.log('Child found:', child);
        if (!child) {
            console.error('Invalid Child ID provided:', childId);
            return res.status(400).json({ error: 'Invalid Child Id provided.' })
        }

        const newFeed = new NewsFeed({
            caregiver: caregiver,
            title: title,
            content: content,
            child: childId,
         });
        await newFeed.save();

        console.log('New post created:', newFeed);
        res.status(201).json(newFeed);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(400).json({ error: error.message })
    }
});
    //parent newsfeed route
router.get('/', verifyToken,  async (req, res) => {
    const userId = req.user._id;
    console.log('Fetching newsfeeds for user:', userId);

    try {

        const isCaregiver = req.user.role === 'Caregiver';

        let childIds = []
        if (!isCaregiver) {

            const children = await Child.find({ parents: userId }).select('_id');
            childIds = children.map(child => child._id);
        }

        let newsFeed = [];
        if (isCaregiver) {

        newsFeed = await NewsFeed.find({ caregiver: userId })
            .populate('caregiver', 'username')
            .populate('child', 'name')
            .sort({ timestamp: -1 });
        } else {
            newsFeed = await NewsFeed.find({ child: { $in: childIds } })
                .populate('caregiver', 'username')
                .populate('child', 'name')
                .sort({ timestamp: -1 });
        }        
        console.log('Newsfeed found:', newsFeed);
        res.status(200).json(newsFeed) 
   
    } catch (error) {
        console.error('Error fetching newsfeed:', error.message);
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
        const updatedPost = await NewsFeed.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('caregiver', 'username')
            .populate('child', 'name')

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
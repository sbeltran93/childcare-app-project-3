const express = require('express');
const router = express.Router();
const Child = require('../models/child')
const verifyToken = require('../middleware/verify-token');

router.post('/', verifyToken, async (req, res) => {
    const {name, age, notes }  = req.body;
    const tomato = req.user._id;
    console.log("user", req.user)
    try {
        const newChild = new Child({ 
            name,
            age,
            caregiver: tomato,
            // parentName: caregiverId,
            notes,
         });
        await newChild.save();
        res.status(201).json(newChild);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:childId', async (req, res) => {
    const caregiverId = req.user.userId;
    try {
        const child = await Child.findOne({ _id: req.params.childId, caregiver: userId });
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }
        res.status(200).json(child);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;
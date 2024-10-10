const express = require('express');
const router = express.Router();
const Child = require('../models/child')
const verifyToken = require('../middleware/verify-token');

router.post('/childs', verifyToken, async (req, res) => {
    const {name, age, notes }  = req.body;
    const caregiverId = req.user._id;

    try {
        const newChild = new ChildModel({ 
            name,
            age,
            caregiver: caregiverId,
            parentName: caregiverId,
            notes,
         });
        await newChild.save();
        res.status(201).json(newChild);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:caregiverId', async (req, res) => {
    try {
        const children = await Child.find({ caregiver: req.params.caregiverId });
        res.status(200).json(children);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;
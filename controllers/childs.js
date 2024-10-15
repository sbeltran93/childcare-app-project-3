const express = require('express');
const router = express.Router();
const Child = require('../models/child')
const verifyToken = require('../middleware/verify-token');

router.post('/', verifyToken, async (req, res) => {
    const {name, age, notes }  = req.body;
    const caregiver = req.user._id;
    try {
        const newChild = new Child({ 
            name,
            age,
            caregiver: caregiver,
            
            notes,
         });
        await newChild.save();
        res.status(201).json(newChild);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const childs = await Child.find({ caregiver: req.user._id });
        res.status(200).json(childs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:userId', verifyToken, async (req, res) => {
    const caregiver = req.user._id;
    try {
        const child = await Child.findOne({ _id: req.params.childId, caregiver: caregiver });
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }
        res.status(200).json(child);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.put('/:childId', verifyToken, async (req, res) => {
    try {
        const childId = req.params.childId;
        const caregiverId = req.user._id;
        const child = await Child.findOne({ _id: childId, caregiver: caregiverId });

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const { name, age, notes } = req.body;
        child.name = name;
        child.age = age;
        child.notes = notes;

        await child.save();
        res.status(200).json(child);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:childId', verifyToken, async (req, res) => {
    try {
        const childId = req.params.childId;
        const child = await Child.findByIdAndDelete(childId);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
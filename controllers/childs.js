const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Child = require('../models/child');
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');
const verifyOwnership = require('../middleware/verifyOwnership');
const verifyRole = require('../middleware/verifyRole');


//Create for child, caregiver can only add a child to the DB
router.post('/', verifyToken, verifyRole('Caregiver'), async (req, res) => {
    const {name, age, notes, parents }  = req.body;
    const caregiver = req.user._id;
    console.log('Logged-in user (req.user):', req.user);

    try {
        if (!mongoose.Types.ObjectId.isValid(caregiver)) {
            return res.status(400).json({ error: 'Invalid caregiver ID' })
        }
        const caregiverObjectId = new mongoose.Types.ObjectId(caregiver);

        if (parents.some(parent => !mongoose.Types.ObjectId.isValid(parent))) {
            return res.status(400).json({ error: 'One or more parent IDs are invalid' });
        }

        const parentsObjectIds = parents.map(parent => new mongoose.Types.ObjectId(parent));

    // Find the caregiver and check if it exists
    const caregiverUser = await User.findById(caregiver);
    if (!caregiverUser) {
      return res.status(400).json({ error: "Caregiver not found" });
    }

    // Check if all parents exist
    const parentUsers = await User.find({
         '_id': { $in: parents } 
    });
    if (parentUsers.length !== parents.length) {
      return res.status(400).json({ error: "Some parents not found" });
    }
    const newChild = new Child({ 
        name,
        age,
        notes,
        caregiver: caregiverObjectId,
        parents: parentsObjectIds,
    });
        await newChild.save();
        res.status(201).json(newChild);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


/*
//showing all children by caregiver, logged in, verified caregiver can only view list of children
router.get('/', verifyToken, verifyRole('Caregiver'),  async (req, res) => {
    try {
        const childs = await Child.find({ caregiver: req.user._id });
        res.status(200).json(childs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
*/
router.get('/', verifyToken, async (req, res) => {
    const { role, _id } = req.user

    try {
        let children;

        if (role === 'Caregiver') {
            children = await Child.find({ caregiver: _id });
        } else if (role === 'Parent') {
            children = await Child.find({ parents: _id })
        }
        else {
            return res.status(403).json({ error: 'Access forbidden' })
        }

        res.status(200).json(children)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
/*
//view of child by id, access for both parents and caregivers
router.get('/:childId', verifyToken, async (req, res) => {
    const { _id: userId, role } = req.user;
    // const caregiver = req.user._id;
    // const role = req.user.role;

    try {
        let child;

    if (role === 'Parent') {
        child = await Child.findOne({
             _id: req.params.childId, 
             parents: userId 
            });
    } else if (role === 'Caregiver') {
        child = await Child.findOne({ 
            _id: req.params.childId, 
            caregiver: userId 
        });
    }      
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }
        res.status(200).json(child);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
*/
//edit childs info, only caregivers can edit
router.put('/:childId', verifyToken, verifyRole('Caregiver'), async (req, res) => {
    const { name, age, notes } = req.body;
    try {
        const { childId } = req.params; 
        const { role, _id } = req.user;     
        const caregiverId = req.user._id;
    
        const child = await Child.findOne({ _id: childId, caregiver: caregiverId });

        if (!child) {
            return res.status(404).json({ error: 'Child not found or you do not have permission to edit info' });
        }
/*
        if (role === 'Caregiver' && child.caregiver.toString() !== _id.toString()) {
            return res.status(403).json({ error: 'You do not have access to edit child\'s info.' })
        }
*/
        child.name = name;
        child.age = age;
        child.notes = notes;

        await child.save();
        res.status(200).json(child);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:childId', verifyToken, verifyRole('Caregiver'), async (req, res) => {
    try {
        const childId = req.params.childId;
        const child = await Child.findByIdAndDelete(childId);

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
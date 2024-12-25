
const jwt = require('jsonwebtoken')

const Child = require('../models/child');

async function verifyOwnership(req, res, next) {
    try {
        const childId = req.params.id;
        const userId = req.params._id;

        const child = await Child.findById(childId)
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }
        if (child.caregiver.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to access this' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = verifyOwnership;

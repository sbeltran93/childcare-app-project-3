const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    caregiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    notes: {
        type: String
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Child', childSchema);
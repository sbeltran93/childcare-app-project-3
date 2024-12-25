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
        required: true,
    },
    notes: {
        type: String,
    },    
    parents: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    }, {
    timeStamps: true,
});

module.exports = mongoose.model('Child', childSchema);
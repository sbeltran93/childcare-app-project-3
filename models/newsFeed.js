const mongoose = require('mongoose');

const newsFeedSchema = new mongoose.Schema({
    caregiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    child: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
        required: true,
     },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NewsFeed', newsFeedSchema);
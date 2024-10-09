const mongoose = require('mongoose')
const newsFeed = require('./newsFeed')

const commentSchema = new mongoose.Schema({
    newsFeed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsFeed',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', commentSchema)
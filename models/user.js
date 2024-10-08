const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    hashedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['parent', 'caregiver'],
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
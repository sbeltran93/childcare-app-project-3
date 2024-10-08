const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const SALT_LENGTH = 12;

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign(
                { username: user.username, _id: user._id},
                process.env.JWT_SECRET);
            res.status(200).json({ token }) 
        } else {
            res.json({ message: 'Username or password incorrect, please try again.' })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


router.post('/signup', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.status(400).json
        ({ error: 'Username already taken' })
    }
    const emailInDatabase = await User.findOne({ email:req.body.email });
    if (emailInDatabase) {
        return res.status(400).json
        ({ error: 'Email is already in use. Please try a different email, or login.' })
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, SALT_LENGTH);

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        hashedPassword,
        role: req.body.role
    });
    const token = jwt.sign(
        { username: user.username, _id: user._id},
        process.env.JWT_SECRET);

    res.status(201).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  };
});

module.exports = router;
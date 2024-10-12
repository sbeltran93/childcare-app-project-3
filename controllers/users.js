const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const SALT_LENGTH = 12;

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign(
                { username: user.username, _id: user._id, email: user.email, role: user.role},
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
    console.log("Received signup request:", req.body);

  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        console.log("Username already taken:", req.body.username);
        return res.status(400).json
        ({ error: 'Username already taken' })
    }
    const emailInDatabase = await User.findOne({ email:req.body.email });
    if (emailInDatabase) {
        console.log("Email already in use:", req.body.email);
        return res.status(400).json
        ({ error: 'Email is already in use. Please try a different email, or login.' })
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, SALT_LENGTH);
    console.log("Hashed password:", hashedPassword);

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        hashedPassword,
        role: req.body.role
    });
    console.log("User created:", user);

    const token = jwt.sign(
        { username: user.username, _id: user._id, email: user.email, role: user.role},
        process.env.JWT_SECRET);

        console.log("Token generated:", token);

    res.status(201).json({ user, token })
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(400).json({ error: error.message })
  };
});

router.put('/:tomatoid', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.tomatoid, req.body, {new: true});
        console.log(updatedUser)
        console.log(req.params.tomatoid)
        console.log(req.body)
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
            
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).send()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;
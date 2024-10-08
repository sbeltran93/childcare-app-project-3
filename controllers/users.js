const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
    res.json({ message: 'Signup route' });
});

module.exports = router;
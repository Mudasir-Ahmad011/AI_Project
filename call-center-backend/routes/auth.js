const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
const { name,username, email, password, role, phonenumber } = req.body;
// const hashedPassword = await bcrypt.hash(password, 10);
const newUser = new User({ name,username, email, password, role, phonenumber
});
await newUser.save();
res.status(201).json({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // if (!user || !(await bcrypt.compare(password, user.password))) {
    // return res.status(401).json({ message: 'Invalid credentials' });
    // }
    if(!user || password!=user.password){
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', user });
});



module.exports = router;
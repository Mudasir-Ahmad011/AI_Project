const express = require('express');
const User = require('../models/User');
const router = express.Router();

//Get the Agents
router.get('/', async (req, res) => {
    const agents = await User.find({ role: 'agent' });
    res.json(agents);
    });
module.exports = router;

// Create a new product
router.post('/', async (req, res) => {
const { name,username, email, password, role,phonenumber } = req.body;
const newUser = new User({ name,username, email, password, role, phonenumber});
await newUser.save();
res.status(201).json({ message: 'User created successfully' });
});

// Update a product
router.put('/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id,
    req.body, { new: true });
    res.json(updatedUser);
 });


 // Delete a product
router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
});


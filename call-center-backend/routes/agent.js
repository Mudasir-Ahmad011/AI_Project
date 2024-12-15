const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');

const { GoogleAuth } = require('google-auth-library');

const googleAuth = new GoogleAuth({
  keyFilename: 'D:/5th Semester/AI/Project/call-center-backend/callcenter-444719-42a84ab87313.json'
});


const upload = multer({ dest: 'uploads/' });
router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
    // const client = new SpeechClient();
    const client = new SpeechClient({ auth: googleAuth });
    const file = fs.readFileSync(req.file.path);
    const audioBytes = file.toString('base64');
  
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16', // Adjust based on your file format
      // sampleRateHertz: '44100',
      languageCode: 'en-US',
    };
  
    const request = {
      audio: audio,
      config: config,
    };
  
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  
    res.json({ transcription });
  });



//Get the Customers
router.get('/', async (req, res) => {
    const {agentUsername} = req.query;
    const customers = await Customer.find({ agentUsername:agentUsername });
    res.json(customers);
});

// Add a new Customer
router.post('/', async (req, res) => {
const { name,age,email,phone,address,agentUsername } = req.body;
const newCustomer = new Customer({ name,age,email,phone,address,agentUsername});
await newCustomer.save();
res.status(201).json({ message: 'Customer added successfully' });
});

// Update a Customer
router.put('/:id', async (req, res) => {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id,
    req.body, { new: true });
    res.json(updatedCustomer);
 });

  // Delete a Customer
 router.delete('/:id', async (req, res) => {
     await Customer.findByIdAndDelete(req.params.id);
     res.json({ message: 'Customer deleted' });
 });
 

module.exports = router;
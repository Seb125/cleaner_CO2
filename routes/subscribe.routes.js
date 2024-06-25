const express = require('express');
const router = express.Router();
const axios = require('axios');
const RegionData = require('../models/RegionData'); // Adjust the path as needed
const Email = require("../models/Email");
const Phone = require("../models/Phone");

router.post('/subscribe', async (req, res) => {
  const { email, region } = req.body;
    try {
        // Logic to save or update the Email in the database
        const existingEmail = await Email.findOne({ email, region });
        if (existingEmail) {
            // Update existing Email if necessary
            console.log(`Email already exists for ${email} in ${region}`);
        } else {
            // Create a new Email
            const newEmail = new Email({ email, region });
            await newEmail.save();
            // Send confirmation email
            console.log(`New Email created for ${email} in ${region}`);
        }
        res.status(200).send('Email successful');
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).send('Error processing Email');
    }
});

router.post('/whatsapp', async (req, res) => {
  const { phone, region } = req.body;
    try {
        // Logic to save or update the subscription in the database
        const existingSubscription = await Phone.findOne({ phone, region });
        if (existingSubscription) {
            // Update existing subscription if necessary
            console.log(`Subscription already exists for ${phone} in ${region}`);
        } else {
            // Create a new subscription
            const newPhone = new Phone({ phone, region });
            await newPhone.save();
            // Send confirmation phone
            console.log(`New subscription created for ${phone} in ${region}`);
        }
        res.status(200).send('Subscription successful');
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).send('Error processing subscription');
    }
});


module.exports = router;



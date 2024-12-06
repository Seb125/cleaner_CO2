const express = require('express');
const router = express.Router();
const axios = require('axios');
const RegionData = require('../models/RegionData'); // Adjust the path as needed
const Email = require("../models/Email");
const Phone = require("../models/Phone");
const nodemailer = require('nodemailer');

const regions = ["50Hertz", "TenneT", "TransnetBW", "Amprion"];

async function getAllEmailSubscriptions() {

    try {

      subscriptionData = await Email.find({});
      return subscriptionData;
      
    } catch (error) {
      console.log(error);
    }
  };

async function getLatestRegionsData () {

    try {

        const regionPromises = regions.map((region) => {
            return RegionData.findOne({ region }).sort({
                createdAt: -1,
              })
        });

        const latestRegionResults = await Promise.all(regionPromises);

        return latestRegionResults;
        
    } catch (error) {
        console.log(error)
    }
}

router.post('/', async (req, res) => {
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

router.get('/deleteSubscriptions', async (req, res) => {
    try {
        await Email.deleteMany({});
        res.status(200).send({message: "Deleting Done"})
    } catch (error) {
        console.log(error)
    }
    
})

router.get('/nodemailer', async (req, res) => {
    
    try {

        GMAIL_PWD = process.env.GMAIL_PWD;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'sebaschwarz92@gmail.com',
              pass: GMAIL_PWD
            }
          });
          
        

        const emailSubs = await getAllEmailSubscriptions();

        const regionData = await getLatestRegionsData();
          
        

        // create Email List for each specific Region

        // TenneT
        
        const TennetEmailAdresses = ["margaritatikis@gmail.com", "schwarz.duscheleit@hotmail.de"];
        const HertzEmailAdresses = [];
        const TransnetBWEmailAdresses = [];
        const AmprionEmailAdresses = [];

        emailSubs.forEach((emailSub) => {
            switch (emailSub.region) {
                case "50Hertz":
                    HertzEmailAdresses.push(emailSub.email);
                    break;
                case "TenneT":
                    TennetEmailAdresses.push(emailSub.email);
                    break;
                case "TransnetBW":
                    TransnetBWEmailAdresses.push(emailSub.email);
                    break;
                case "Amprion":
                    AmprionEmailAdresses.push(emailSub.email);
                    break;
            }
        });

        

        console.log(TennetEmailAdresses, "Tennet Email Addresses")

        let HertzMailOptions = {
            from: 'sebaschwarz92@gmail.com',
            bcc: HertzEmailAdresses.join(),
            subject: regionData.find(function(element) {return element.region === '50Hertz'}).data.message,
            text: regionData.find(function(element) {return element.region === '50Hertz'}).data.forecast_result
          };

        let TenneTMailOptions = {
            from: 'sebaschwarz92@gmail.com',
            bcc: TennetEmailAdresses.join(),
            subject: regionData.find(function(element) {return element.region === 'TenneT'}).data.message,
            text: regionData.find(function(element) {return element.region === 'TenneT'}).data.forecast_result
        };

        let TransnetBWMailOptions = {
            from: 'sebaschwarz92@gmail.com',
            bcc: TransnetBWEmailAdresses.join(),
            subject: regionData.find(function(element) {return element.region === 'TransnetBW'}).data.message,
            text: regionData.find(function(element) {return element.region === 'TransnetBW'}).data.forecast_result
          };

        let AmpironMailOptions = {
            from: 'sebaschwarz92@gmail.com',
            bcc: AmprionEmailAdresses.join(),
            subject: regionData.find(function(element) {return element.region === 'Amprion'}).data.message,
            text: regionData.find(function(element) {return element.region === 'Amprion'}).data.forecast_result
        };

        const emailOptions = [HertzMailOptions, TenneTMailOptions, TransnetBWMailOptions, AmpironMailOptions];
        

        emailOptions.forEach((emailOption) => {

            // transporter.sendMail(emailOption, function(error, info){
            //     if (error) {
            //       console.log(error);
            //     } else {
            //       console.log('Email sent: ' + info.response);
            //     }
            //   });

        });

        res.status(200).json(body= {"message": "Emails send successfully!"});

        
    } catch (error) {
        console.log(error)
    }

});


module.exports = router;



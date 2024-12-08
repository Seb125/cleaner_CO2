const cron = require('node-cron');
const axios = require("axios");
const RegionData = require('../models/RegionData');
const Email = require("../models/Email");
const nodemailer = require('nodemailer');


// Define an array of regions
const regions = ["50Hertz", "TenneT", "TransnetBW", "Amprion"];

async function fetchAndSaveMultipleRegions(regions) {
    console.log("Fetching and saving data for regions:", regions);
    try {
      for (const region of regions) {
        const url = `https://us-central1-engaged-card-410714.cloudfunctions.net/new-function-1`;
        const response = await axios.post(url, { region }); // Pass the region in the request body
        // only create new when not empty
        
        if (response.data.forecast_result.length !== 0) {
          // here comes the code to check if dat ais not empty
          const newData = new RegionData({ region, data: response.data });
          await newData.save();
          console.log("Data saved successfully for region:", region);
        }
      }
      console.log(
        "Data fetching and saving completed for all requested regions."
      );
    } catch (error) {
      throw error;
    }
  };

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


async function sendALlEmailsToSubscribers() {

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
      
    
    console.log("emailSubs", emailSubs)
    // create Email List for each specific Region

    // TenneT
    
    const TennetEmailAdresses = [];
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
    
    console.log(emailOptions, "emailOptions")

    emailOptions.forEach((emailOption) => {

        if (emailOption.bcc.length !== 0) {
            
            transporter.sendMail(emailOption, function(error, info){
                if (error) {
                  console.log(error, "Error sending Email");
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        }
        

    });

    
} catch (error) {
    console.log(error)
}
};


  

cron.schedule('0 0 * * *', async () => {
    try {
        result = await fetchAndSaveMultipleRegions(regions);
        await sendALlEmailsToSubscribers();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    

})
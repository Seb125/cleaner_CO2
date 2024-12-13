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

const extractHours = (forecastResult) => {

  // Extract time frames form text data
  const timeRangePattern =
    /(\b([01]?[0-9]|2[0-3]):[0-5][0-9] to \b([01]?[0-9]|2[0-3]):[0-5][0-9]\b)/g;
  let match;
  const hours = [];
  
  while ((match = timeRangePattern.exec(forecastResult)) !== null) {
    // Extract the start hour and end hour
    const startHour = match[0].split(":")[0]; // Get the hour before the first colon
    const endHour = match[0].split("to")[1].split(":")[0].trim(); // Get the hour before the second colon

    hours.push({
      start: parseInt(startHour, 10),
      end: parseInt(endHour, 10),
    });
  }

  return hours;
}


async function sendALlEmailsToSubscribers() {

  try {

    GMAIL_PWD = process.env.GMAIL_PWD;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'energyguideforecast@gmail.com',
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
        from: 'energyguideforecast@gmail.com',
        bcc: HertzEmailAdresses.join(),
        subject: regionData.find(function(element) {return element.region === '50Hertz'}).data.message,
        text: extractHours(regionData.find(function(element) {return element.region === '50Hertz'}).data.forecast_result).length === 0 ? "Currently there is no data available for region 50Hertz" : regionData.find(function(element) {return element.region === '50Hertz'}).data.forecast_result
      };

    let TenneTMailOptions = {
        from: 'energyguideforecast@gmail.com',
        bcc: TennetEmailAdresses.join(),
        subject: regionData.find(function(element) {return element.region === 'TenneT'}).data.message,
        text: extractHours(regionData.find(function(element) {return element.region === 'TenneT'}).data.forecast_result).length === 0 ? "Currently there is no data available for region TenneT" : regionData.find(function(element) {return element.region === 'TenneT'}).data.forecast_result
    };

    let TransnetBWMailOptions = {
        from: 'energyguideforecast@gmail.com',
        bcc: TransnetBWEmailAdresses.join(),
        subject: regionData.find(function(element) {return element.region === 'TransnetBW'}).data.message,
        text: extractHours(regionData.find(function(element) {return element.region === 'TransnetBW'}).data.forecast_result).length === 0 ? "Currently there is no data available for region TransnetBW" : regionData.find(function(element) {return element.region === 'TransnetBW'}).data.forecast_result
      };

    let AmpironMailOptions = {
        from: 'energyguideforecast@gmail.com',
        bcc: AmprionEmailAdresses.join(),
        subject: regionData.find(function(element) {return element.region === 'Amprion'}).data.message,
        text: extractHours(regionData.find(function(element) {return element.region === 'Amprion'}).data.forecast_result).length === 0 ? "Currently there is no data available for region Amprion" : regionData.find(function(element) {return element.region === 'Amprion'}).data.forecast_result
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
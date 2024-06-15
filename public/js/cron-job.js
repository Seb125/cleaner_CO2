const cron = require('node-cron');
const axios = require("axios");
const RegionData = require('../../models/RegionData');


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
  }

cron.schedule('0 0 * * *', async () => {
    try {
        result = await fetchAndSaveMultipleRegions(regions);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    

})
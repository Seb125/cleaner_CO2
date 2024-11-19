const express = require("express");
const axios = require("axios");
const router = express.Router();
const RegionData = require("../models/RegionData"); // Adjust the path as needed
const Subscription = require("../models/Email");

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

router.get("/", (req, res) => {
  const currentDate = new Date().toLocaleDateString();
  res.render("index", { currentDate });
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/kontakt", (req, res) => {
  res.render("kontakt");
});

// Manual test route for data fetching and saving
router.get("/test-fetch", async (req, res) => {
  console.log("Manual test fetch initiated at", new Date());
  try {
    await fetchAndSaveMultipleRegions(regions);
    res.send("Data fetching and saving initiated successfully.");
  } catch (error) {
    console.error("Error during test fetch:", error);
    res.status(500).send("Error during test fetch.");
  }
});

router.get("/:region", async (req, res) => {

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

  try {
    
    const region = req.params.region;
    // Retrieve the latest saved data for the region
    let latestData = await RegionData.findOne({ region }).sort({
      createdAt: -1,
    });

    if (!latestData) {
      return res.status(404).send("No data found for the specified region");
    }

    // check if forecast result is available, otherwise provide second last entry in database

    // Extract forecast_result from the nested "data" object
    let forecastResult = latestData.data.forecast_result;

    let hours = extractHours(forecastResult);
    console.log("Hours", hours)
    if (hours.length == 0) {
      const result = await RegionData.find({ region })
      .sort({
        createdAt: -1,
      })
      .skip(1)
      .limit(1);
      latestData = result[0]
      console.log("Latest Data", latestData)
      // replace hours with second latest data available
      forecastResult = latestData.data.forecast_result;
      hours = extractHours(forecastResult)
    }

    
    
    console.log(latestData)
    
    console.log("hours", hours)
    // also electricity values need to be sent to frontend
    const wind_energy_values = latestData.data.generation_data;
    // add last value to index 0, as this aligns with the graph in the frontend
    wind_energy_values.unshift(wind_energy_values.pop());
    //only use the raw numbers
    const wind_energy_numbers = wind_energy_values.map((item) => {
      return (
        item["Wind Generation"]
      )
    });


    console.log(hours);

    res.render("results", {
      data: { forecastResult: forecastResult, region: region, time_frames: JSON.stringify(hours), wind_energy_numbers: JSON.stringify(wind_energy_numbers), currentDate: new Date().toLocaleDateString() },
    });
  } catch (error) {
    console.log(error);
  }
});

// Route to fetch data for a specific region using POST
router.post("/region-data/:region", async (req, res) => {
  const region = req.params.region;
  try {
    console.log(req.body);

    // Retrieve the latest saved data for the region
    const latestData = await RegionData.findOne({ region }).sort({
      createdAt: -1,
    });

    if (!latestData) {
      return res.status(404).send("No data found for the specified region");
    }

    // Extract forecast_result from the nested "data" object
    const forecastResult = latestData.data.forecast_result;
    console.log("forecast Result", forecastResult)
    // Respond with a success message and forecast_result
    res.status(200).json({
      message: `Latest data fetched and saved for region: ${region}`,
      forecast_result: forecastResult,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});



module.exports = router;

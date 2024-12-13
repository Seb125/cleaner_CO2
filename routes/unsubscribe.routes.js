const express = require("express");

const router = express.Router();



router.get('/', async(req, res) => {
    try {

        userEmail = req.params;

        console.log(userEmail)
        
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;
const express = require("express");
const router = express.Router();
const Email = require("../models/Email");



router.get('/', async(req, res) => {
    try {

        userEmail = req.query;

        const deletedEmail = await Email.findOneAndDelete({ email: userEmail.email });

        console.log("Email deleted successfully:", deletedEmail);
        
        return res.status(200).json({"message": "Unsubscribed successfully"});
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;
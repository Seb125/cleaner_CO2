const cron = require('node-cron');
const nodemailer = require('nodemailer');

cron.schedule('* * * * *', () => {
    // Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
    host: 'gmail',
    auth: {
        user: 'sebaschwarz92@gmail.com', // Your email address
        pass: process.env.NODEMAILER_PWD // Your email password or application-specific password
    }
});

// Define email options
let mailOptions = {
    from: 'sebaschwarz92@gmail.com', // Sender address
    to: 'schwarz.duscheleit@hotmail.de', // List of recipients
    subject: 'Test Email from Node.js', // Subject line
    text: 'Hello from Node.js!', // Plain text body
    html: '<p>Hello from <b>Node.js</b>!</p>' // HTML body (optional)
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});

})
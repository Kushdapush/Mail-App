const nodemailer = require('nodemailer');
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
require("dotenv").config();
const PORT = "3000"
const receivers = ['kushagragupta625@gmail.com'];

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.post('/add', (req, res) => {
    const newReceiver = req.body.newReceiver;
    receivers.push(newReceiver);
    res.redirect('/sending');
});

app.get('/', (req, res) => {
    res.render('index');
});
app.get("/sending", (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    let mailOptions = {
        from: 'thisisnotkush@gmail.com',
        to: receivers,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    if (receivers.length > 1) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    res.redirect('/');
});
app.listen(PORT, () => {
    console.log("We are live!.. ");
});
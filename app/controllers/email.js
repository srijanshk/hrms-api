var nodemailer = require('nodemailer');

module.exports = function sendEmail(email, subject, data){
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure : false,
            auth: {
                user: 'tools@sevadev.com',
                pass: 'seva!@#$'
            }
        });

        let mailOptions = {
            from: 'tools@sevadev.com',
            to: email,
            subject: subject,
            text: data
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                return error;
            }
            else{
                return "Your email is sent";
            }
        });
    });
}
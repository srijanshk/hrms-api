var sendEmail = require('./email')

exports.email = function (req, res) {
    let contactEmail = req.body.contactEmail;
    let name = req.body.name;
    let email = req.body.email;
    let subject = req.body.subject;
    let message = name + ' with email_id '+email+' sent following message: \n'+req.body.message;

    return res.json({message: sendEmail(contactEmail, subject, message)});
}
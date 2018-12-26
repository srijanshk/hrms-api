var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authConfig = require('../../config/auth');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');


function generateToken(user) {
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10000008000
    });
}

function setUserInfo(request) {
    return {
        _id: request._id,
        email: request.email,
        role: request.role,
    };
}

exports.login = function (req, res, next) {

    var userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });

}

exports.register = function (req, res, next) {

    var email = req.body.email;
    var password = generator.generate({
        length: 10,
        numbers:true,
        uppercase:true,
        symbols: true
    })
    var pass = password;
    var role = req.body.role;
    var fullname = req.body.fullname;
    var contactNo = req.body.contactNo;
    var post = req.body.post;
    var branch = req.body.branch;
    var project = req.body.project;
    var lineManager = req.body.lineManager;

    if (!email) {
        return res.status(422).send({
            error: 'You must enter an email address'
        });
    }

    User.findOne({
        email: email
    }, function (err, existingUser) {

        if (err) {
            return next(err);
        }

        if (existingUser) {
            return res.status(422).send({
                error: 'That email address is already in use'
            });
        }

        var user = new User({
            email: email,
             password: password,
            role: role,
            fullname: fullname,
            contactNo: contactNo,
            post: post,
            branch: branch,
            project: project,
            lineManager: lineManager
        });
        
        user.save(function (err, user, done) {

            if (err) {
                return next(err);
            }

            var userInfo = setUserInfo(user);

            res.status(201).json({
                message: 'Please Check you Email Address',
                // token: 'JWT ' + generateToken(userInfo),
                // user: userInfo
            });

        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure : false,
                auth: {
                    user: 'apihrms@gmail.com',
                    pass: 'P@sswo123'
                }
            });

            let mailOptions = {
                from: 'no-reply@sevadev.com',
                to: user.email,
                subject: 'Credentials for HRMS',
                text: 'You are receiving this because your email have been registered to seva development HRMS.\n\n'+
                                'Please use this email address and password for the login and Got to Profile to complete your Information.\n\n'+
                                'email:' + user.email + '.\n\n'+
                                'password:'+pass, // plain text body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    return console.log(error);
                }
            });
        });
        });

    });

}

exports.roleAuthorization = function (roles) {

    return function (req, res, next) {

        var user = req.user;

        User.findById(user._id, function (err, foundUser) {

            if (err) {
                res.status(422).json({
                    error: 'No user found.'
                });
                return next(err);
            }

            if (roles.indexOf(foundUser.role) > -1) {
                return next();
            }

            res.status(401).json({
                error: 'You are not authorized to view this content'
            });
            return next('Unauthorized');

        });

    }

}

exports.forgetpassword = function (req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                email: req.body.email
            }).exec(function(err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('user not found.');
                }
            });
        },
        function(user, done) {
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function(user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                done(err, token, new_user);
              });
        },
        function(token, user, done) {
            nodemailer.createTestAccount((err, account) => {
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure : false,
                    auth: {
                        user: 'apihrms@gmail.com',
                        pass: 'P@sswo123'
                    }
                });
    
                let mailOptions = {
                    from: 'no-reply@sevadev.com',
                    to: user.email,
                    subject: 'Reset Password Request',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                       'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                   'http://' + req.headers.host + '/api/auth/resetpassword?token=' + token + '\n\n' +
                                      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if(error) {
                        return console.log(error);
                    } else {
                        return res.json({ message: 'Kindly check your email for further instructions'});  
                    }
                });
            });
        }
    ], function(err) {
        return res.status(422).json({message: err});
    });
};

exports.resetpassword = function(req, res, next) {

    User.findOne({
        // resetPasswordToken: req.body.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }).exec(function(err, user) { 

       
        
        if (!err && user) {
            if (req.body.newPassword === req.body.verifyPassword) {
                
                user.password = req.body.newPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                
                user.save(function(err) {
                    if (err) {
                        return res.status(422).send({
                            message: err
                        });
                    } else {
                        nodemailer.createTestAccount((err, account) => {
                            let transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure : false,
                                auth: {
                                    user: 'apihrms@gmail.com',
                                    pass: 'P@sswo123'
                                }
                            });
                
                            let mailOptions = {
                                from: 'no-reply@sevadev.com',
                                to: user.email,
                                subject: 'Password Reset Confirmation',
                                text: 'Hello,\n\n' +
                                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if(error) {
                                    return console.log(error);
                                } else {
                                    return res.json({ message: 'Password reset'});
                                }
                            });
                        });
                    }
                });
            } else {
                return res.status(422).send({
                    message: 'Password do not match'
                });
            }
        } 
        else {
            return res.status(400).send({
                message: 'Password reset token is invalid or has expired.'
            });
        }
    });
};

exports.updatepassword = function (req, res, next) {
   
            User.findById(req.user._id, function (err, user) {

            if (!err && user) {

              
               var validPassword = bcrypt.compareSync(req.body.oldPassword,user.password)
               if (validPassword){
                if (req.body.newPassword == req.body.confirmPassword) {
                    user.password = req.body.newPassword;
                    user.save(function (err) {
                        if (err) {
                            return res.status.send({message : err});
                        } 
                        res.status(201).json({
                            message : 'Your Password has been updated'
                        })
                    })
                } else {
                   return res.status(422).send({
                        message : 'New Password do not match'
                    });
                }
                } else {
                    return res.status(422).send({
                        message : 'Old password did not match'
                    });
                }
            
                 }   
            });
}
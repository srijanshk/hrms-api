var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authConfig = require('../../config/auth');
var generator = require('generate-password');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var DisableUser = require('../models/disableusers');
var sendEmail = require('./email');
var UserInfo = require('../models/userinfo');


var AccessControl = require('accesscontrol');
    let grantList = [
        {role: 'NormalUser', resource: 'user', action: 'read:any', attributes: '*'},
        {role: 'NormalUser', resource: 'user', action: 'update:own', attributes: '*'},
        {role: 'ProjectAdmin', resource: 'project', action: 'update:any', attributes: '*'},
        {role: 'ViewAdmin', resource: 'user', action: 'read:any', attributes: '*'},
        // User Admin Policy
        //resource user
        {role: 'UserAdmin', resource: 'user', action: 'read:own', attributes: '*'},
        {role: 'UserAdmin', resource: 'user', action: 'read:any', attributes: '*'},
        {role: 'UserAdmin', resource: 'disableuser', action: 'read:any', attributes: '*'},
        {role: 'UserAdmin', resource: 'user', action: 'update:own', attributes: '*'},
        {role: 'UserAdmin', resource: 'user', action: 'update:any', attributes: '*'},
        {role: 'UserAdmin', resource: 'user', action: 'Create:any', attributes: '*'},
        {role: 'UserAdmin', resource: 'user', action: 'delete:any', attributes: '*'},      
        
        //profile

        {role: 'NormalUser', resource: 'profile', action: 'create:own', attributes: '*'},
        {role: 'NormalUser', resource: 'profile', action: 'update:own', attributes: '*'},
        {role: 'NormalUser', resource: 'profile', action: 'read:own', attributes: '*'},
        {role: 'NormalUser', resource: 'profile', action: 'read:any', attributes: '*'},
        {role: 'ViewAdmin', resource: 'profile', action: 'read:any', attributes: '*'},
        // User Admin Policy
        // resource profile
        {role: 'UserAdmin', resource: 'profile', action: 'create:own', attributes: '*'},
        {role: 'UserAdmin', resource: 'profile', action: 'create:any', attributes: '*'},
        {role: 'UserAdmin', resource: 'profile', action: 'update:own', attributes: '*'},
        {role: 'UserAdmin', resource: 'profile', action: 'update:any', attributes: '*'},
        {role: 'UserAdmin', resource: 'profile', action: 'read:own', attributes: '*'},
        {role: 'UserAdmin', resource: 'profile', action: 'read:any', attributes: '*'},
        {role: 'UserAdmin', resource: 'profile', action: 'delete:any', attributes: '*'},
        
    ];
    var ac = new AccessControl(grantList); 

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
        permission: request.permission
    };
}


exports.login = function (req, res, next) {

    var userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });

};

exports.register = function (req, res, next) {
    var permissions = ac.can(req.user.permission).createAny('user');
    if(req.user.role == 'admin' || permissions.granted ) {

        
        var email = req.body.email;
    var password = generator.generate({
        length: 10,
        numbers:true,
        uppercase:true,
        symbols: true
    });
    var pass = password;
    var role = req.body.role; // Overall application role this is not hte same as in the grant list 
    var fullname = req.body.fullname;
    var contactNo = req.body.contactNo;
    var post = req.body.post;
    var branch = req.body.branch;
    var project = req.body.project;
    var lineManager = req.body.lineManager;
    var permission = req.body.permission;

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
            lineManager: lineManager,
            permission: permission
        });
        
        user.save(function (err, user, done) {

            if (err) {
                return next(err);
            }

            var userInfo = setUserInfo(user);
            let contactEmail = user.email;
            let subject = 'Credentials for HRMS';
            let message = 'You are receiving this because your email have been registered to seva development HRMS.\n\n'+
            'Please use this email address and password for the login and Got to Profile to complete your Information.\n\n'+
            'email:' + user.email + '\n\n'+
            'password:'+pass + '\n\n' +
            'Website:' + 'http://hrms.sevadev.com'  ;

            res.status(201).json({
                message: 'Email Has been Sent',
                 token: 'JWT ' + generateToken(userInfo),
                user: userInfo,
            });
            sendEmail(contactEmail, subject, message) 
        });
    });
    } else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
    
};

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

    };

};

exports.ChangePermission = function(req,res) {
    if (req.body.role == 'admin') {
        var permission = req.body.permission;
        User.findByIdAndUpdate({_id: req.params._id},permission, (err, result) => {
            if(err) {
                res.send(err)
            }
            res.json({message:'Permission Updated'});
        });
    } else {
        res.status(403).json({message : 'Unauthorized'});
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
            let contactEmail = user.email;
                 let subject = 'Reset Password Request';
                    let message=  'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                       'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                  'Link:' + 'http://hrms.sevadev.com/resetpassword?token=' + token + '\n\n' + 
                                      'If you did not request this, please ignore this email and your password will remain unchanged.\n' ;
             
                sendEmail(contactEmail, subject, message);
                res.json({ message: 'Kindly check your email for further instructions'});
        }
    ], function(err) {
        return res.status(422).json({message: err});
}
);};

exports.resetpassword = function(req, res, next) {

    User.findOne({
         resetPasswordToken: req.query.token,
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
                var contactEmail = user.email;
                var subject = 'Password Reset Confirmation';
                var message=   'Hello,\n\n' +
                                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' + '\n\n' +
                                'Website:' + 'http://hrms.sevadev.com'
                           
                             
                                sendEmail(contactEmail, subject, message);
                                res.json({ 
                                    message: 'Password has been reset'});
                        
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

              
               var validPassword = bcrypt.compareSync(req.body.oldPassword,user.password);
               if (validPassword){
                if (req.body.newPassword == req.body.confirmPassword) {
                    user.password = req.body.newPassword;
                    user.save(function (err) {
                        if (err) {
                            return res.status.send({message : err});
                        } 
                        res.status(201).json({
                            message : 'Your Password has been updated'
                        });
                    });
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
};

exports.getAllUsers = function (req, res, next) {
    var permission = ac.can(req.user.permission).readAny('user');
if(req.user.role == 'admin' || permission.granted ) {
        User.find({active: req.user.active}, function (err, users) {
       
            if (err) {
                res.send(err);
            }
            res.json(users);
        }).select("-password").select("-__v")
    } else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
   
};

exports.getuserbyid = function (req, res, next) {
    var permission1 = ac.can(req.user.permission).readAny('user');
    var permission2 = ac.can(req.user.permission).readOwn('user');
    if(req.user.role == 'admin' || permission1.granted || permission2.granted) {

    User.findById(
        {_id:req.params._id, active: req.user.active}, function (err, user) {
         if (err) {
             res.send(err);
         }
         res.json(user);
     }).select("-password").select("-__v");
    } else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
};

// exports.getUserbyLM = function (req, res, next) {

//     User.find({lineManager: req.user.fullname, active: req.user.active}, function (err, users) {
//         if (err) {
//             res.send(err);
//         } 
//         res.json(users);
//     });

// }

exports.disableUser = function (req, res, next) {
    var permission = ac.can(req.user.permission).deleteAny('user');
    if(req.user.role == 'admin' || permission.granted) {

   User.findByIdAndUpdate({_id:req.params._id}, {active: false}, function (err, users) {
       if (err) {
           res.send(err);
       }
 User.findByIdAndRemove(
    {_id:req.params._id}, 
     function(err, doc) {
         if (doc) {
             DisableUser.insertMany(doc, function(err, doc){
                res.status(200).json({
                    message : 'User Id has Been Disabled and Moved'
                });
             });
         } else {
             res.status(502).json({
                 message: 'Bad Request'
             });
         }
     }
 )
});
    }else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
}

exports.UpdateProject = function(req, res, next) {
    var permission = ac.can(req.user.permission).updateAny('project');
    if(req.user.role == 'admin' || permission.granted) {
        var Project = req.body.Project;
        User.findByIdAndUpdate({ _id: req.params._id}, Project, function(err, res) {
                if (err)
                {
                     return res.send(err)
                } else {
                    res.status(201).json({
                        message : "Userinfo is updated"
                    }); 
                    UserInfo.findOneAndUpdate({ user_id: req.params.user_id}, Project, function(err, res) {
                    });
                }
                
        });
    } else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
}

exports.enableUser = function (req, res, next) {
    var permission = ac.can(req.user.permission).deleteAny('user');
    if(req.user.role == 'admin' || permission.granted) {
    DisableUser.findByIdAndUpdate({_id:req.params._id}, {active: true}, function (err, users) {
        if (err) {
            res.send(err);
        }
  DisableUser.findByIdAndRemove(
     {_id:req.params._id},
      function(err, doc) {
          if (doc) {
              User.insertMany(doc, function(err, doc){
                 res.status(200).json({
                     message : 'User Id has Been Enabled'
                 });
              });
          } else {
              res.status(502).json({
                  message: 'Bad Request'
              });
          }
      }
  )
 });
} else {
    res.status(403).json({
        message: 'Permission not assigned'
    });
}
}

exports.getDisabledUsers = function(req,res, next) {
    var permission = ac.can(req.user.permission).readAny('disableuser');
    if(req.user.role == 'admin' || permission.granted) {
    DisableUser.find({active: false}, function(err, users) {
        if (err) {
            res.send(err);
        }
        res.json(users);
    });
} else {
    res.status(403).json({
        message: 'Permission not assigned'
    });
}
}


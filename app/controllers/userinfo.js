var UserInfo = require('../models/userinfo');
var User = require('../models/user');
var ImageUpload = require('../models/upload');
var multer = require('multer');

var AccessControl = require('accesscontrol');
    let grantList = [
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

        // User
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
        
        
    ];
    var ac = new AccessControl(grantList); 



var MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}
var storage = multer.diskStorage({
    
    destination: function(req, file, cb) {
        var isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, 'uploads');
    },
    filename: function(req, file, cb) {
        const name = file.originalname;
        var fullname = req.user.fullname.toLowerCase().split(' ').join('-');
        var ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, fullname  + '.' + ext);
    }
});



exports.getUserinfos = function (req, res, next) {
    var permission = ac.can(req.user.permission).readAny('profile');
    if(req.user.role == 'admin' || permission.granted ) {
        UserInfo.find(function (err, userinfos) {
            if (err) {
                res.send(err);
            }
    
            res.json(userinfos);
        });
    } else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
};

var upload = multer({
    storage: storage,
   
}).single('image');


 exports.CreateUserInfo =  function (req,res, next) {
    var permission = ac.can(req.user.permission).createOwn('profile');
    if(req.user.role == 'admin' || permission.granted ) { 
        var userinfodata = {
            email: req.user.email,
            user_id: req.user._id,
                   fullname: req.user.fullname,
                   dob: req.body.dob,
                   nationality: req.body.nationality,
                   contactNo: req.user.contactNo,
                   emergencycontact: req.body.emergencycontact,
                   emergencycontactno: req.body.emergencycontactno,
                   permanentaddress: req.body.permanentaddress,
                   temporaryaddress: req.body.temporaryaddress,
                   gender: req.body.gender,
                   religion: req.body.religion,
                   citizenshipno: req.body.citizenshipno,
                   fathername: req.body.fathername,
                   mothername: req.body.mothername,
                   familycontactno: req.body.familycontactno,
                   status: req.body.status,
                   spouse: req.body.spouse,
                   childname: req.body.childname,
                   bloodGroup: req.body.bloodGroup,
                   medicalHistory: req.body.medicalHistory,
                    education: req.body.education,
                   experience: req.body.experience,
                 facebook: req.body.facebook,
                 instagram: req.body.instagram,
                 twitter: req.body.twitter,
                 linkedin: req.body.linkedin,
                 github: req.body.github,
                 skype: req.body.skype,
                 post: req.user.post,
                 branch: req.user.branch,
                 lineManager: req.user.lineManager,
                 Project: req.user.Project,
                 certification: req.body.certification
               };
       
       UserInfo.create(userinfodata, function (err, userinfo) {
           if (err) {
               res.send(err);
           }
               res.send(userinfo);
           }); 
    } else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
};

exports.deleteUserinfo = function (req, res, next) {
    var permission = ac.can(req.user.permission).deleteAny('profile');
    if(req.user.role == 'admin' || permission.granted ) { 
    UserInfo.findByIdAndRemove({
        _id: req.params._id
    }, function (err, userinfo) {
        
        res.json('Removed Successfully');
        
    });
} else {
    res.status(403).json({
        message: 'Permission not assigned'
    });
}
};

exports.getUserinfobyuserid = function (req, res, next) {
    var permission1 = ac.can(req.user.permission).readAny('profile');
    var permission2 = ac.can(req.user.permission).readOwn('profile');
    if(req.user.role == 'admin' || permission1.granted  || permission2.granted ) { 
    UserInfo.findOne({

        user_id: req.params.user_id
    }, function (err, userinfo) {
        if (err) {
            res.send(err);
        }
        res.json(userinfo);
    });
} else {
    res.status(403).json({
        message: 'Permission not assigned'
    });
}
};

exports.getUserinfobyid = function (req, res, next) {
    var permission1 = ac.can(req.user.permission).readAny('profile');
    var permission2 = ac.can(req.user.permission).readOwn('profile');
    if(req.user.role == 'admin' || permission1.granted  || permission2.granted ) { 
   
    UserInfo.findById(
       {_id:req.params._id}, function (err, userinfo) {
        if (err) {
            res.send(err);
        }
        res.json(userinfo);
    });
} else {
    res.status(403).json({
        message: 'Permission not assigned'
    });
}
};


exports.updateUserinfo = function(req, res, next) {
    var permission1 = ac.can(req.user.permission).updateAny('profile');
    var permission2 = ac.can(req.user.permission).updateOwn('profile');
    if(req.user.role == 'admin' || permission1.granted  || permission2.granted ) { 
    var userinfodata = {

        dob: req.body.dob,
        nationality: req.body.nationality,
        contactNo: req.user.contactNo,
        emergencycontact: req.body.emergencycontact,
        emergencycontactno: req.body.emergencycontactno,
        permanentaddress: req.body.permanentaddress,
        temporaryaddress: req.body.temporaryaddress,
        gender: req.body.gender,
        religion: req.body.religion,
        citizenshipno: req.body.citizenshipno,
        fathername: req.body.fathername,
        mothername: req.body.mothername,
        familycontactno: req.body.familycontactno,
        status: req.body.status,
        spouse: req.body.spouse,
        childname: req.body.childname,
        bloodGroup: req.body.bloodGroup,
        medicalHistory: req.body.medicalHistory,
         education: req.body.education,
        experience: req.body.experience,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      linkedin: req.body.linkedin,
      post: req.body.post,
      branch: req.body.branch,
      lineManager: req.body.lineManager,
      Project: req.body.Project,
      certification: req.body.certification,
      github: req.body.github,
      skype: req.body.skype,
      
    };
    UserInfo.findOneAndUpdate({
        user_id: req.params.user_id
    },userinfodata, function (err, userinfo) {
      
            if (!err) {
                
                res.status(201).json({
                    message : "Userinfo is updated"
                }); 
                var otherinfo = {
                    post: req.body.post,
                  branch: req.body.branch,
                  lineManager: req.body.lineManager,
                  Project: req.body.Project,
                };
                User.findByIdAndUpdate(req.user._id,otherinfo, function (err, user) {
                });
            } else {
                res.send(err);
            }
            
        });
    } else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
};

exports.GetUploadProfile = function(req, res, next) {
    var permission1 = ac.can(req.user.permission).readAny('profile');
    var permission2 = ac.can(req.user.permission).readOwn('profile');
    if(req.user.role == 'admin' || permission1.granted  || permission2.granted ) {
    ImageUpload.find(function (err, profileimage) {
        if (err) {
            res.send(err);
        }
        res.json(profileimage);
    });
} else {
    res.status(403).json({
        message: 'Permission not assigned'
    });
}
};

exports.getProfilebyuser = function(req, res, next) {
    var permission1 = ac.can(req.user.permission).readAny('profile');
    var permission2 = ac.can(req.user.permission).readOwn('profile');
    if(req.user.role == 'admin' || permission1.granted  || permission2.granted ) {
ImageUpload.findOne({
    user_id: req.params.user_id
}, function(err, result) {
    if (err) {
        res.send(err);
    }
    res.json(result);
});
    } else {
        res.status(403).json({
            message: 'Permission not assigned'
        });
    }
};

exports.UpdateProfile = function(req,res, next) {
    var permission1 = ac.can(req.user.permission).updateOwn('profile');
    if(req.user.role == 'admin' || permission1.granted  ) {

    upload(req, res, function(err) {
        if(err)
        {
            res.send(err);
        }
        var url = req.protocol + '://' + req.get("host");
        var imagepath = url + "/uploads/" + req.file.filename;
        ImageUpload.findOneAndUpdate({
            user_id: req.params.user_id
        },imagepath, function(err, update) {
            if (err) return next(err);
            res.status(202).json({
                message : 'Profile Picture Updated'
            });
        });
    });
} else {
    res.status(403).json({
        message: 'Permission not assigned'
    });
}
}

exports.UploadProfile = function(req, res, next) {

    var permission1 = ac.can(req.user.permission).createOwn('profile');
    if(req.user.role == 'admin' || permission1.granted  ) {

    upload(req, res, function(err) {
        if(err)
        {
            res.send(err);
        }

        var user_id = req.user.user_id;

        ImageUpload.findOne({
            id: user_id
        }, function (err, existingphoto) {
            if (err) {
            
                return next(err);
            }
    
            if (existingphoto) {
                return res.status(422).send({
                    error: 'You already Have uploaded the picture'
                });
            }

        
       
       
        var url = req.protocol + '://' + req.get("host");
        

        var Profileimagedata = {
            imagepath: url + "/uploads/" + req.file.filename,
            fullname: req.user.fullname,
            user_id: req.user._id,
        }

        ImageUpload.create(Profileimagedata, function(err,profileimage) {
            if (err) {
                res.end(err);
            }
                res.status(201).json({
                    message : "Profile is uploaded",
                    data: profileimage
                })
        });
    });
    });
} else {
    res.status(403).json({
        message: 'Permission not assigned'
    });
}
};

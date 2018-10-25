var Profile = require('../models/profile');

exports.getProfiles = function (req, res, next) {

    Profile.find(function (err, profiles) {
        if (err) {
            res.send(err);
        }

        res.json(profiles);
    });
}

exports.createProfile = function (req, res, next) {



    var profileData = {
        fullName: req.body.fullName,
        address: req.body.address,
        designation: req.body.designation,
        workstation: req.body.workstation,
        phoneNumber: req.body.phoneNumber,
        projectName: req.body.projectName,
        email: req.user.email
    }

    Profile.create(profileData, function (err, profile) {

        if (err) {
            res.send(err);
        }

        Profile.create(function (err, profiles) {
            if (err) {
                res.send(err);
            }
            res.json(profile);

        });
    });
}


exports.deleteProfile = function (req, res, next) {

    Profile.remove({
        _id: req.params.profile_id
    }, function (err, profile) {
        
        res.json(profile);
        console.log(res.json(profile));
    });
}


exports.getProfile = function (req, res, next) {

    Profile.find({
        user: req.params.user
    }, function (err, profile) {
        if (err) {
            res.send(err);
        }
        res.json(profile);
    });
}
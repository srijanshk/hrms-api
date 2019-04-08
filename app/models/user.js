var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



var UserSchema = new mongoose.Schema({

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        
    },
    fullname: String,
    contactNo: Number,
    post: String,
    branch: Array,
    lineManager: {
        type: String,
    },
    Project: {
        type: String,
        default: 'Bench'
    },
    role: {
        type: String,
        enum: [ 'admin', 'user'],
         default: 'user'
    },
    permission: {
        type: Array,
         default: ['NormalUser']
    },
    active: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date

}, {
    timestamps: false
});

UserSchema.pre('save', function (next) {

    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {

        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {

            if (err) {
                return next(err);
            }

            user.password = hash;
            next();

        });

    });

});

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {

    bcrypt.compare(passwordAttempt, this.password, function (err, isMatch) {

        if (err) {
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });

}

module.exports = mongoose.model('User', UserSchema);
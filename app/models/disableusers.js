
var mongoose = require('mongoose');
var DisableUserSchema = new mongoose.Schema({

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        
    },
    role: {
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
    },
    active: {
        type: Boolean,
    }

}, {
    timestamps: false
});

module.exports = mongoose.model('DisableUser', DisableUserSchema);
var mongoose = require('mongoose');
var UserSchema = require('./user');
var LeaveSchema = new mongoose.Schema({

    

    reason: {
        type: String,
        required: true
    },
    starting_date: {
        type: Date,
        required: true
    },
    ending_date: {
        type: Date,
        required: true
    },
    total_days: {
        type: Number,
        required: true
    },
    address_on_leave: {
        type: String,
        required: true
    },

    user: {
        ref: 'User',
        type: String
    }

});
module.exports = mongoose.model('Leave', LeaveSchema);
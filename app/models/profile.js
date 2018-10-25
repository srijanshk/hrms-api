var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    workstation: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: Number,
        required: true
    },

    projectName: {
        type: String,
        required: true
    },

    email: {
        type: mongoose.Schema.Types.String,
      }



});

module.exports = mongoose.model('Profile', ProfileSchema)
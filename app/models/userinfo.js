var mongoose = require('mongoose');


var UserInfoSchema = new mongoose.Schema({

    fullname: {
        type: String,
        required: true
    },

    dob: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    contactno: {
        type: Number,
        required: true
    },
    emergencycontact: {
        type: String,
        required: true
    },
    emergencycontactno: {
        type: Number,
        required: true
    },
    permanentaddress: {
        type: String,
        required: true
    },
    temporaryaddress: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    religion: {
        type: String,
        required: true
    },
    citizenshipno: {
        type: String,
        required: true
    },
    fathername: {
        type: String,
    },
    mothername: {
        type: String,
    },
    familycontactno: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    spouse: {
        type: String
    },
    childname: {
        type: String
    },
    bloodGroup: {
        type: String,
        required: true
    },
    medicalHistory: {
        type: String,
        required: true
    },
    education : [{
        institutionName: String,
        level: String,
        yearGraduated: String,
        board: String,
        faculty: String
    }],
    experience : [{
        company: String,
        degination: String,
        fromYear: Date,
        toYear: Date,
        refrence: String,
    }],
    email: {
        type: mongoose.Schema.Types.String,
    },
    user_id: {
        type:  mongoose.Schema.Types.String,
    }
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);
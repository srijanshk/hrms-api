var mongoose = require('mongoose');


var UserInfoSchema = mongoose.Schema({
    

    email: {
        type: mongoose.Schema.Types.String,
    },
    user_id: {
        type:  mongoose.Schema.Types.ObjectId,
    },

    fullname: {
        type : mongoose.Schema.Types.String,
    },

    post: {
            type : mongoose.Schema.Types.String,
        },
    Project: {
            type : mongoose.Schema.Types.String,
        },
    branch: {
            type : mongoose.Schema.Types.String,
        },
    lineManager: {
            type : mongoose.Schema.Types.String,
        },
    dob: {
        type: Date,
      
    },
    nationality: {
        type: String
      
     },

    contactNo:{ 
        type : mongoose.Schema.Types.Number,
    },
    emergencycontact: {
        type: String,
       
    },
    emergencycontactno: {
        type: Number,
        
    },
    permanentaddress: {
        type: String,
    },
    temporaryaddress: {
        type: String,
    },
    gender: {
        type: String,
    },
    religion: {
        type: String,
    },
    citizenshipno: {
        type: String,
    },
    fathername: {
        type: String,
    },
    mothername: {
        type: String,
    },
    familycontactno: {
        type: Number,
    },
    status: {
        type: String,
    },
    spouse: {
        type: String
    },
    childname: {
        type: String
    },
    bloodGroup: {
        type: String,
    },
    medicalHistory: {
        type: String,
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
    certification : [{
        coursetaken: String,
        dateofcompletion: Date,
    }],
    facebook : String,
    twitter : String,
    instagram : String,
    linkedin : String,
    github: String,
    skype: String,
    
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);
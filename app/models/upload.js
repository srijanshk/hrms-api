var mongoose = require('mongoose');


var ProfileImageSchema = mongoose.Schema({
    
     imagepath: {
        type: String,
    },

    fullname: {
        type : mongoose.Schema.Types.String,
    },
    user_id: {
        type:  mongoose.Schema.Types.ObjectId,
    }
});

module.exports = mongoose.model('ProfileImage', ProfileImageSchema);
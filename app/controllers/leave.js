var Leave = require('../models/leave');

exports.getLeaves = function(req,res,next){
    Leave.find(function(err, leaves) {

        if (err){
            res.sed(err);
        }
        res.json(leaves);
    });
}



exports.createLeave = function(req, res, next) {

    var leaveData = {
        reason: req.body.reason,
        starting_date: req.body.starting_date,
        ending_date: req.body.ending_date,
        total_days: req.body.total_days,
        address_on_leave: req.body.address_on_leave,
      }
    Leave.create( leaveData, function(err, leave) {

        if (err){
            res.send(err);
        }
        Leave.find(function(err,leaves) {
            if (err){
                res.send(err);
            }
            res.json(leaves);
        });
    });

}
exports.deleteLeave = function(req, res, next) {
    Leave.remove({
        _id : req.params.leave_id 
    }, function (err, leave) {
        res.json(leave);
    
    });
}
    
exports.getLeave = function(req,res, next) {
    Leave.find({
        _id : req.params.leave_id
    }, function(err, leaves) {
        if (err){
            res.sed(err);
        }
        res.json(leaves);
    });
}
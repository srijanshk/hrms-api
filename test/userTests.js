var should = require('should'),
	sinon = require('sinon'),
	mongoose = require('mongoose');

require('sinon-mongoose');

var User = require('./../app/models/user');

describe(' User Module Testing', function () {
	describe('Create User Test', function () {
		
	it('Should Save User', function (done) {
		var usermock = sinon.mock( new User({ 
		email : "pray@sevadev.com",
		role: "employee",
		fullname: "Full name 2",
		contactNo: 9800000000,
		post: "Senior post",
		branch: "branch",
		lineManager: "Mock 2 "}))
		var user = usermock.object;

		usermock
		.expects('save')
		.yields(null , 'Please Check you Email Address')

		user.save(function(err, result) {
			usermock.verify();
			usermock.restore();
			should.equal('Please Check you Email Address', result)
			done();
		});
	});
	});
})
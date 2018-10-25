var AuthenticationController = require('./controllers/authentication'),
    LeaveController = require('./controllers/leave'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport'),
    profileController = require('./controllers/profiles');

var requireAuth = passport.authenticate('jwt', {
        session: false
    }),
    requireLogin = passport.authenticate('local', {
        session: false
    });

module.exports = function (app) {
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        leaveRoutes = express.Router();

    profileRoutes = express.Router();

    // Auth Routes


    // Auth Routes


    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    authRoutes.get('/protected', requireAuth, function (req, res) {
        res.send({
            content: 'Success'
        });
    });

    //Leave Routes

    apiRoutes.use('/leaves', leaveRoutes);
    leaveRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), LeaveController.getLeaves);
    leaveRoutes.get('/:user', requireAuth, AuthenticationController.roleAuthorization(['employee']), LeaveController.getLeave);
    leaveRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), LeaveController.createLeave);
    leaveRoutes.delete('/:leave_id', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), LeaveController.deleteLeave);

    //Profile Routes

    apiRoutes.use('/profile', profileRoutes);
    profileRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), profileController.getProfiles);
    profileRoutes.get('/:user', requireAuth, AuthenticationController.roleAuthorization(['employee']), profileController.getProfile);
    profileRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), profileController.createProfile);
    profileRoutes.delete('/:profile_id', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), profileController.deleteProfile);



    //Leave Routes

    apiRoutes.use('/leaves', leaveRoutes);
    leaveRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['manager', 'admin']), LeaveController.getLeaves);
    leaveRoutes.get('/:user', requireAuth, AuthenticationController.roleAuthorization(['employee']), LeaveController.getLeave);
    leaveRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), LeaveController.createLeave);
    leaveRoutes.delete('/:leave_id', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), LeaveController.deleteLeave);


    //set up routes
    app.use('/api', apiRoutes);
}
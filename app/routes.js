var AuthenticationController = require('./controllers/authentication'),
    LeaveController = require('./controllers/leave'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

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
    imageRoutes = express.Router();

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

    //Image Routes
    // apiRoutes.use('/images', imageRoutes);
    // imageRoutes.get('/', requireAuth,ImageController.getImages);
    // imageRoutes.get('/:image_id', requireAuth,ImageController.getImageById);
    // imageRoutes.post('/', requireAuth, ImageController.createImage);
    // //imageRoutes.post('/:image_id', requireAuth,  AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']),ImageController.updateImage);
    // imageRoutes.delete('/:image_id', requireAuth, ImageController.deleteImage);


    //set up routes
    app.use('/api', apiRoutes);
}
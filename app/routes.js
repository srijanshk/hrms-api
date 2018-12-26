var AuthenticationController = require('./controllers/authentication'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport'),
    userController = require('./controllers/userinfo')

var requireAuth = passport.authenticate('jwt', {
        session: false
    }),
    requireLogin = passport.authenticate('local', {
        session: false
    });

module.exports = function (app) {
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router();

    // Auth Routes


    // Auth Routes


    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    authRoutes.post('/forgetpassword', AuthenticationController.forgetpassword);
    authRoutes.post('/resetpassword', AuthenticationController.resetpassword);
    authRoutes.put('/updatepassword', requireAuth, AuthenticationController.updatepassword);

    authRoutes.get('/protected', requireAuth, function (req, res) {
        res.send({
            content: 'Success'
        });
    });

    


    //Userinfo Routes
    apiRoutes.use('/userinfo', userRoutes);
    userRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), userController.getUserinfos);
    userRoutes.get('/:user_id', requireAuth, AuthenticationController.roleAuthorization(['employee']), userController.getUserinfo);
    userRoutes.get('/get/:_id', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), userController.getUserinfobyid);
    userRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), userController.CreateUserInfo);
    userRoutes.delete('/:userinfo_id', requireAuth, AuthenticationController.roleAuthorization(['employee', 'manager', 'admin']), userController.deleteUserinfo);



    //set up routes
    app.use('/api', apiRoutes);
}
var AuthenticationController = require('./controllers/authentication'),
    testRampEmail = require('./controllers/testRampEmail')
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport'),
    userController = require('./controllers/userinfo');
    var User = require('./models/user');
     
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
        uploadRoutes = express.Router();

    //test ramp email Routes
    apiRoutes.post('/sendemail', testRampEmail.email)

    // Auth Routes
    apiRoutes.post('/register', AuthenticationController.register)

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', requireAuth, AuthenticationController.roleAuthorization([ 'admin']), AuthenticationController.register);
    authRoutes.put('/manageroles', requireAuth, AuthenticationController.roleAuthorization(['admin']), AuthenticationController.ChangePermission);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    authRoutes.post('/forgetpassword', AuthenticationController.forgetpassword);
    authRoutes.post('/resetpassword', AuthenticationController.resetpassword);
    authRoutes.put('/updatepassword',AuthenticationController.roleAuthorization(['admin','user']), requireAuth, AuthenticationController.updatepassword);
    authRoutes.get('/user/:_id', requireAuth,AuthenticationController.roleAuthorization(['admin','user']), AuthenticationController.getuserbyid);
    authRoutes.get('/user', requireAuth,AuthenticationController.roleAuthorization(['admin','user']), AuthenticationController.getAllUsers);
    authRoutes.put('/project/:_id', requireAuth,AuthenticationController.roleAuthorization(['admin','user']), AuthenticationController.UpdateProject);
    // authRoutes.get('/lm', requireAuth,  AuthenticationController.roleAuthorization(['user']), AuthenticationController.getUserbyLM);
    authRoutes.get('/disabled_users', requireAuth, AuthenticationController.roleAuthorization(['admin','user']), AuthenticationController.getDisabledUsers);
    authRoutes.delete('/user/:_id', requireAuth, AuthenticationController.roleAuthorization(['user',  'admin']), AuthenticationController.disableUser);
    authRoutes.put('/user/:_id',requireAuth, AuthenticationController.roleAuthorization(['user',  'admin']), AuthenticationController.enableUser);

    authRoutes.get('/protected', requireAuth, function (req, res) {
        res.send({
            content: 'Success'
        });
    });  

    


    //Userinfo Routes
    apiRoutes.use('/userinfo', userRoutes);
    userRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']), userController.getUserinfos);
    userRoutes.get('/:user_id', requireAuth,AuthenticationController.roleAuthorization(['admin','user']), userController.getUserinfobyuserid);
    userRoutes.get('/get/:_id', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']), userController.getUserinfobyid);
    userRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']), userController.CreateUserInfo);   
    userRoutes.delete('/:userinfo_id', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']), userController.deleteUserinfo);
    userRoutes.put('/:user_id', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']),  userController.updateUserinfo);


    //Upload Routes 
    apiRoutes.use('/uploads', uploadRoutes);
    uploadRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']), userController.UploadProfile);
    uploadRoutes.put('/:user_id', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']), userController.UpdateProfile);
    uploadRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']), userController.GetUploadProfile);
    uploadRoutes.get('/:user_id', requireAuth, AuthenticationController.roleAuthorization(['user', 'admin']), userController.getProfilebyuser);

    //set up routes
    app.use('/api', apiRoutes);
};


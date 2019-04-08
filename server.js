var express = require('express');
var app = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path')


var databaseConfig = require('./config/database');
var router = require('./app/routes');

mongoose.connect(databaseConfig.url,{ useNewUrlParser: true });

app.listen(process.env.PORT || 5000);
console.log("App listening on port 5000");

//upload Middleware 



// body parser 

app.use(bodyParser.urlencoded({
    extended: true
})); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
//any request with /uploads will be accessible
app.use('/uploads', express.static(path.join('uploads')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());

router(app);
require('rootpath')();
var express = require('express');
var app = express();
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressJwt = require('express-jwt');
var config = require('config.json');
var logger = require('morgan');

var port = process.env.port || 3000;

//mongo config
mongoose.connect(config.dbUrl);



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth 
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/user/authenticate', '/api/user/register' , '/api/user/verify'] }));

app.use(express.static(path.join(__dirname, 'public')));


// // routes
app.use('/submission', require('./controller/submission.controller'));
app.use('/login', require('./controller/login.controller'));
app.use('/register', require('./controller/register.controller'));
app.use('/app', require('./controller/app.controller'));

// api config
app.use('/api/candidate',require('./controller/api/candidate.controller'));
app.use('/api/user',require('./controller/api/user.controller'));


app.get('/', function(req, res){
	res.redirect('/submission');
});

// start server
var server = app.listen(port, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
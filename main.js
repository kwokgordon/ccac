var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var namespace = require('express-namespace');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var cors = require('cors');
var i18n = require('i18n');

var app = express();

global.__basedir = __dirname;
var configSecret = require(path.join(__basedir, 'config/secret.js'));

// view engine setup
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__basedir, 'app/views'));

i18n.configure({
	locales:['eng', 'cht', 'chs'],
	directory: __basedir + '/locales'
});

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: configSecret.nodemailer.user,
		pass: configSecret.nodemailer.pass
	}
});

var whitelist = ["https://docs.google.com",
	"https://drive.google.com",
	"https://www.google.com",
	"https://sites.google.com"
];

var corsOptions = {
	origin: function(origin, callback) {
		var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
		callback(null, originIsWhitelisted);
	}
};

app.use(i18n.init);
app.use(favicon(path.join(__basedir, 'public/img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static(path.join(__basedir, 'public')));

app.options('*', cors());

////////////////////////////////////////////////////////////////////
// Routes

require(path.join(__basedir, 'app/controllers/routes'))(app, transporter);

////////////////////////////////////////////////////////////////////

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('main/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('main/error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

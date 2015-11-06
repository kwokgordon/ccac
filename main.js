var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var namespace = require('express-namespace');
var mongoose = require('mongoose');
var ejs = require('ejs');
var cors = require('cors');
var i18n = require('i18n');
var i18nRoutes = require( "i18n-node-angular" );

var app = express();

console.log("Environment: " + process.env.NODE_ENV);

global.__basedir = __dirname;
var db = require(path.join(__basedir, 'config/db.js'));

console.log("Mongo: " + db.db.mongo);

// DB config
mongoose.connect(db.db.mongo);

// view engine setup
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__basedir, 'app/views'));

i18n.configure({
	locales:['eng', 'cht', 'chs'],
	directory: __basedir + '/locales'
});

app.use(i18n.init);
app.use(i18nRoutes.getLocale);
i18nRoutes.configure( app, { locales:['eng', 'cht', 'chs'], directory : __basedir + '/locales' } );

app.use(favicon(path.join(__basedir, 'public/img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__basedir, 'public')));

////////////////////////////////////////////////////////////////////
// Routes

require(path.join(__basedir, 'app/controllers/api'))(app);
require(path.join(__basedir, 'app/controllers/routes'))(app);

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

// All files should follow this structure
//
// http://url/lang/header/sidebar

/////////////////////////////////////////////////////////////////////////////
// pre-define function

var path = require('path');
var configSecret = require(path.join(__basedir, 'config/secret.js'));
var http_auth = require('http-auth');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var basic = http_auth.basic({
		realm: configSecret.http_auth.secret
	}, function(username, password, callback) {
		callback(username == configSecret.http_auth.username && password == configSecret.http_auth.password);
});

var auth = http_auth.connect(basic);

// Events Calendar
var calendars = require(path.join(__basedir, 'config/google_calendars.js'));

// Room Booking Calendar
var room_booking = require(path.join(__basedir, 'config/room_booking_calendars.js'));

// All Google Docs
var docs = require(path.join(__basedir, 'config/google_docs.js'));
var hashTable = require('node-hashtable');

// Life Groups Calendar
var lg_cal = require(path.join(__basedir, 'config/groups_calendars.js'));
var hashTable_cal = require('node-hashtable');

// Docs HashTable
for(var i = 0; i < docs.docs.length; i++) {
	hashTable.set(docs.docs[i].path, docs.docs[i].doc_id);
}

// Life Group Calendar HashTable
for(var i = 0; i < lg_cal.calendars.length; i++) {
	hashTable_cal.set(lg_cal.calendars[i].path, lg_cal.calendars[i].calendar);
}

// Argument index
var lang_arg = 1;
var header_arg = 2;
var sidebar_arg = 3;

String.prototype.cut = function() { 
//	return this.replace(new RegExp('/' + "*$"),'').substring(4); 
	return this.substring(4); 
};

String.prototype.mobilecut = function() { 
//	return this.replace(new RegExp('/' + "*$"),'').substring(4); 
	return this.substring(11); 
};

String.prototype.right = function(n) {
	if(this.length >= n) {
		return this.substring(this.length - n);
	} else {
		return this;
	}
};

function setup_arg(req, res) {
	arg = req.path.split("/");

	req.setLocale(req.params.lang);

	res.locals.lang = req.params.lang;
	res.locals.lg_lang = req.params.lg_lang;
	res.locals.sidebar = req.params.sidebar;
	res.locals.room = req.params.room;
	res.locals.room_booking_calendar = room_booking;
	res.locals.page_size = "full";

	res.locals.s3_bucket = configSecret.aws.s3.bucket;
	res.locals.s3_region = configSecret.aws.s3.region;
	res.locals.s3_access_key = configSecret.aws.s3.access_key;

	if(arg[1] == "mobile") {
		res.locals.path = req.path.mobilecut();
		res.locals.header = (arg.length > (header_arg+1)) ? arg[header_arg+1]:"";

		res.locals.doc_id = hashTable.get(req.path.substring(7));
		res.locals.calendar = hashTable_cal.get(req.path.mobilecut());
	} else {
		res.locals.path = req.path.cut();
		res.locals.header = (arg.length > header_arg) ? arg[header_arg]:"";

		res.locals.doc_id = hashTable.get(req.path);
		res.locals.calendar = hashTable_cal.get(req.path.cut());
	}
	
}

function fullpageRender(req, res) {
	setup_arg(req, res);
	
	res.render('lang/fullpage');
}

function sidepageRender(req, res) {
	setup_arg(req, res);

	res.locals.page_size = "side";
	
	res.render('lang/sidepage');
}

function mobileRender(req, res) {
	setup_arg(req, res);
	
	res.render('mobile/lang/fullpage');
}

function mobile_LGRender(req, res) {
	setup_arg(req, res);
	
	res.render('mobile/lang/lg_page');
}

/////////////////////////////////////////////////////////////////////////////
// routing

module.exports = function(app) {

	// Welcome page
	app.get('/', function(req, res) {
		res.render('main/index');
	});

	app.get('/admin', auth, function(req, res) {
		res.render('main/admin');
	});

	app.get('/upload_sunday_service', auth, function(req, res) {				
		setup_arg(req, res);
	
		res.render('main/upload_sunday_service');
	});
	
	// Mobile page
	app.namespace('/mobile', function() {

		app.get('/', function(req, res) {
			res.render('mobile/main/index');
		});

		app.get('/error', function(req, res) {
			res.render('mobile/main/error');
		});

		app.namespace('/:lang', function() {
			app.get('/', function(req, res) {
				setup_arg(req, res);

				res.render('mobile/lang/main');
			});

			app.get('/news/:sidebar', function(req, res) {
				setup_arg(req, res);
				
				res.render('mobile/lang/news');
			});
					
			app.get('/about_us/:sidebar', function(req, res) {
				mobileRender(req, res);
			});
					
			app.get('/life_groups/:lg_lang/:sidebar', function(req, res) {
				mobile_LGRender(req, res);
			});
			
			app.get('/ministries/:sidebar', function(req, res) {
				mobileRender(req, res);
			});

			app.get('/chinese_school', function(req, res) {
				mobileRender(req, res);
			});
			
			app.get('/events', function(req, res) {
				setup_arg(req, res);
				
				res.render('mobile/lang/events', {calendar: calendars});
			});

			app.get('/events/:sidebar', function(req, res) {
				setup_arg(req, res);
				
				res.render('mobile/lang/events', {calendar: calendars});
			});			

			app.get('/resources/sunday_service/:congregation', function(req, res) {
				setup_arg(req, res);
				
				res.locals.congregation = req.params.congregation;
				
				res.render('mobile/lang/sunday_service');	
			});
			
			app.get('/resources/room_booking', function(req, res) {
				setup_arg(req, res);

				res.render('mobile/lang/room_booking');	
//				res.render('mobile/lang/room_booking', {room_booking_calendar: room_booking});	
			});
			
			app.get('/resources/room_booking/:room', function(req, res) {
				setup_arg(req, res);
				
				res.render('mobile/lang/room_booking');	
//				res.render('mobile/lang/room_booking', {room_booking_calendar: room_booking});	
			});
			
		});
	});
		
	// Main page
	app.namespace('/:lang', function() {
		
		app.get('/', function(req, res) {
			fullpageRender(req, res);
		});

		app.get('/news', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/news');	
		});

/*
		app.get('/news/:sidebar', function(req, res) {
			setup_arg(req, res);
			
			res.locals.page_size = "side";
			
			res.render('lang/news');	
		});
*/
		
		app.get('/about_us', function(req, res) {
			sidepageRender(req, res);
		});

		app.get('/about_us/:sidebar', function(req, res) {
			sidepageRender(req, res);
		});
				
		app.get('/life_groups', function(req, res) {
			sidepageRender(req, res);
		});

		app.get('/life_groups/:lg_lang/:sidebar', function(req, res) {
			sidepageRender(req, res);
		});

		app.get('/ministries', function(req, res) {
			sidepageRender(req, res);
		});
		
		app.get('/ministries/:sidebar', function(req, res) {
			sidepageRender(req, res);
		});

		app.get('/chinese_school', function(req, res) {
			fullpageRender(req, res);
		});
		
		app.get('/events', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/events', {calendar: calendars});
		});

		app.get('/events/:sidebar', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/events', {calendar: calendars});
		});
		
		app.get('/resources', function(req, res) {
			res.redirect('/' + req.params.lang + '/resources/sunday_service');
		});

		app.get('/resources/sunday_service', function(req, res) {
			setup_arg(req, res);
			
			res.locals.congregation = 'undefined';
			res.locals.page_size = "side";

			res.render('lang/sunday_service');	
		});

		
		app.get('/resources/sunday_service/:congregation', function(req, res) {
			setup_arg(req, res);
			
			res.locals.congregation = req.params.congregation;
			res.locals.page_size = "side";
			
			res.render('lang/sunday_service');	
		});
		
		app.get('/resources/room_booking', function(req, res) {
			setup_arg(req, res);
			
			res.locals.page_size = "side";

			res.render('lang/room_booking');	
//			res.render('lang/room_booking', {room_booking_calendar: room_booking});	
		});

		app.get('/resources/room_booking/:room', function(req, res) {
			setup_arg(req, res);
			
			res.locals.page_size = "side";

			res.render('lang/room_booking');	
//			res.render('lang/room_booking', {room_booking_calendar: room_booking});	
		});
		

/*
		app.get('/*', function(req, res) {
			fullpageRender(req, res);
		});
*/		
	});
}

/////////////////////////////////////////////////////////////////////////////
// Other prototype
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

Date.prototype.iso8601 = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	var hh  = this.getHours().toString();
	var nn  = this.getMinutes().toString();
	var ss  = this.getSeconds().toString();

	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]) + "T" + (dd[1]?dd:"0"+dd[0]) + (nn[1]?nn:"0"+nn[0]) + (ss[1]?ss:"0"+ss[0]) + "Z" ; // padding
};

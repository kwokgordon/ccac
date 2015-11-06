// All files should follow this structure
//
// http://url/lang/header/sidebar

/////////////////////////////////////////////////////////////////////////////
// pre-define function

var path = require('path');

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
	return this.substring(4); 
};

String.prototype.mobilecut = function() { 
	return this.substring(11); 
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

	res.locals.node = res.locals;
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
			});
			
			app.get('/resources/room_booking/:room', function(req, res) {
				setup_arg(req, res);
				
				res.render('mobile/lang/room_booking');	
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

			res.locals.page_size = "side";
			
			res.render('lang/news');	
		});

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
		});

		app.get('/resources/room_booking/:room', function(req, res) {
			setup_arg(req, res);
			
			res.locals.page_size = "side";

			res.render('lang/room_booking');	
		});
		

	});
}


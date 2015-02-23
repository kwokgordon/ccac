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
	
/*
	console.log(req.path);
	console.log(req.path.cut());
	console.log(arg.length);
	console.log(arg);
	console.log(arg[lang_arg]);
	console.log(arg[header_arg]);
	console.log(arg[sidebar_arg]);

	console.log(res.locals.path);
	console.log(res.locals.lang);
	console.log(res.locals.header);
	console.log(res.locals.lg_lang);
	console.log(res.locals.sidebar);
	console.log(res.locals.doc_id);
	console.log(res.locals.calendar);
*/
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

module.exports = function(app, transporter) {

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
			
			app.get('/AGM', function(req, res) {
				setup_arg(req, res);

				res.redirect('https://docs.google.com/document/d/1yeDvid7f4YaU8JycVAjApr2Cq3pI_cISnTGwrQh9Sck/pub?embedded=true');
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

		app.get('/news/:sidebar', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/news');	
		});

		app.get('/AGM', function(req, res) {
			fullpageRender(req, res);
		});
		
		app.get('/about_us', function(req, res) {
			sidepageRender(req, res);
		});
		
		app.get('/about_us/contact_us', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/contact_us');
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
			setup_arg(req, res);
			
			res.render('lang/resources');	
		});

		app.get('/resources/room_booking', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/room_booking');	
//			res.render('lang/room_booking', {room_booking_calendar: room_booking});	
		});

		app.get('/resources/room_booking/:room', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/room_booking');	
//			res.render('lang/room_booking', {room_booking_calendar: room_booking});	
		});
		
		// Contact Us send email
		app.post('/send_email', function(req, res) {
		
			var mailOptions = {
				from: {
					name: req.body.name,
					address: req.body.email
				},
				to: "kwokgordon@gmail.com",
				subject: "Inquiry from church website",
				text: req.body.name + "\n" + req.body.email + "\n" + req.body.message
			};
			
			transporter.sendMail(mailOptions, function(err, info) {
				if(err) {
					console.log("Send Email");
					console.log(err);
					
					res.redirect(req.body.path);
				} else {
					console.log("Message sent");

					res.redirect(req.body.path);
				}
			});
		});

/*
		app.get('/*', function(req, res) {
			fullpageRender(req, res);
		});
*/		
	});
}


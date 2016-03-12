// All files should follow this structure
//
// http://url/lang/header/sidebar

/////////////////////////////////////////////////////////////////////////////
// pre-define function

var path = require('path');

var Page = require(path.join(__basedir, 'app/models/page'));

// Events Calendar
var calendars = require(path.join(__basedir, 'config/google_calendars.js'));

// Room Booking Calendar
var room_booking = require(path.join(__basedir, 'config/room_booking_calendars.js'));

var hashTable = require('node-hashtable');
var hashTable_cal = require('node-hashtable');

// Mongo Call
Page.find({}, function(err, pages) {
	if (err)
		console.log(err);
	
	for(var i = 0; i < pages.length; i++) {
		hashTable.set(pages[i].eng.lang_path, pages[i].eng.doc_id);
		hashTable.set(pages[i].cht.lang_path, pages[i].cht.doc_id);
		hashTable.set(pages[i].chs.lang_path, pages[i].chs.doc_id);

		hashTable_cal.set(pages[i].path, pages[i].google_calendar);
	}
});


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


module.exports = {

	setup_arg: function(req, res) {
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
	},

	fullpageRender: function(req, res) {
		this.setup_arg(req, res);
		
		res.render('lang/fullpage');
	},

	sidepageRender: function(req, res) {
		this.setup_arg(req, res);

		res.locals.page_size = "side";

		res.render('lang/sidepage');
	},

	mobileRender: function(req, res) {
		this.setup_arg(req, res);
		
		res.render('mobile/lang/fullpage');
	},

	mobile_LGRender: function(req, res) {
		this.setup_arg(req, res);
		
		res.render('mobile/lang/lg_page');
	},
	checkLang: function(req, res, next) {
		var arr = ['eng','cht','chs'];
		
		if (arr.indexOf(req.params.lang) == -1)
			res.status(500).render('main/error');
		
		next();
	}
}


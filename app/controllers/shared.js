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


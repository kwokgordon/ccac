// All files should follow this structure
//
// http://url/lang/header/sidebar

/////////////////////////////////////////////////////////////////////////////
// pre-define function

var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared'));

// Events Calendar
var calendars = require(path.join(__basedir, 'config/google_calendars.js'));

/////////////////////////////////////////////////////////////////////////////
// Desktop Routing

module.exports = function(app) {

	// Main page
	app.namespace('/:lang', shared.checkLang, function() {
		
		app.get('/', function(req, res) {
			shared.fullpageRender(req, res);
		});

		app.get('/news', function(req, res) {
			shared.setup_arg(req, res);

			res.locals.page_size = "side";
			
			res.render('lang/news');	
		});

		app.get('/about_us', function(req, res) {
			shared.sidepageRender(req, res);
		});

		app.get('/about_us/:sidebar', function(req, res) {
			shared.sidepageRender(req, res);
		});
				
		app.get('/life_groups', function(req, res) {
			shared.sidepageRender(req, res);
		});

		app.get('/life_groups/:lg_lang/:sidebar', function(req, res) {
			shared.sidepageRender(req, res);
		});

		app.get('/ministries', function(req, res) {
			shared.sidepageRender(req, res);
		});
		
		app.get('/ministries/:sidebar', function(req, res) {
			shared.sidepageRender(req, res);
		});

		app.get('/chinese_school', function(req, res) {
			shared.fullpageRender(req, res);
		});
		
		app.get('/events', function(req, res) {
			shared.setup_arg(req, res);
			
			res.render('lang/events', {calendar: calendars});
		});

		app.get('/events/:sidebar', function(req, res) {
			shared.setup_arg(req, res);
			
			res.render('lang/events', {calendar: calendars});
		});
		
		app.get('/resources', function(req, res) {
			res.redirect('/' + req.params.lang + '/resources/sunday_service');
		});

		app.get('/resources/sunday_service', function(req, res) {
			shared.setup_arg(req, res);
			
			res.locals.congregation = 'undefined';
			res.locals.id = 'undefined';
			res.locals.page_size = "side";

			res.render('lang/sunday_service');	
		});

		app.get('/resources/sunday_service/:congregation', function(req, res) {
			shared.setup_arg(req, res);
			
			res.locals.congregation = req.params.congregation;
			res.locals.id = 'undefined';
			res.locals.page_size = "side";

			res.render('lang/sunday_service');	
		});

		app.get('/resources/sunday_service/:congregation/:id', function(req, res) {
			shared.setup_arg(req, res);
			
			res.locals.congregation = req.params.congregation;
			res.locals.id = req.params.id;
			res.locals.page_size = "side";
			
			res.render('lang/sunday_service');	
		});
		
		app.get('/resources/room_booking', function(req, res) {
			shared.setup_arg(req, res);
			
			res.locals.page_size = "side";

			res.render('lang/room_booking');	
		});

		app.get('/resources/room_booking/:room', function(req, res) {
			shared.setup_arg(req, res);
			
			res.locals.page_size = "side";

			res.render('lang/room_booking');	
		});
		
	});
}


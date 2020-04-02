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
// Mobile routing

module.exports = function(app) {

	// Mobile page
	app.namespace('/mobile', function() {

		app.get('/app', function(req, res) {
			res.render('mobile/app');
		});

		app.get('/', function(req, res) {
			res.render('mobile/main/index');
		});

		app.get('/latest_news', function(req, res) {
			res.redirect('/mobile/eng/news/');
		});

		app.get('/error', function(req, res) {
			res.render('mobile/main/error');
		});

		app.namespace('/:lang', function() {
			app.get('/', function(req, res) {
				shared.setup_arg(req, res);

				res.render('mobile/lang/main');
			});

			/////////////////////////////////////////////////////
			// Church Reno News
			app.get('/news', function(req, res) {
				shared.setup_arg(req, res);

				shared.mobileRender(req, res);
			});
			/////////////////////////////////////////////////////

			app.get('/news/:sidebar', function(req, res) {
				shared.setup_arg(req, res);

				res.render('mobile/lang/news');
			});

			app.get('/about_us/:sidebar', function(req, res) {
				shared.mobileRender(req, res);
			});

			app.get('/life_groups/:lg_lang/:sidebar', function(req, res) {
				shared.mobile_LGRender(req, res);
			});

			app.get('/ministries/:sidebar', function(req, res) {
				shared.mobileRender(req, res);
			});

			app.get('/chinese_school', function(req, res) {
				shared.mobileRender(req, res);
			});

			app.get('/events', function(req, res) {
				shared.setup_arg(req, res);

				res.render('mobile/lang/events', {calendar: calendars});
			});

			app.get('/events/:sidebar', function(req, res) {
				shared.setup_arg(req, res);

				res.render('mobile/lang/events', {calendar: calendars});
			});

			app.get('/resources/sunday_service/:congregation', function(req, res) {
				shared.setup_arg(req, res);

				res.locals.congregation = req.params.congregation;

				res.render('mobile/lang/sunday_service');
			});

			app.get('/resources/room_booking', function(req, res) {
				shared.setup_arg(req, res);

				res.render('mobile/lang/room_booking');
			});

			app.get('/resources/room_booking/:room', function(req, res) {
				shared.setup_arg(req, res);

				res.render('mobile/lang/room_booking');
			});

			app.get('/ministry_plan/', function(req, res) {
				shared.mobileRender(req, res);
			});

			app.get('/ministry_plan/:sidebar', function(req, res) {
				shared.mobileRender(req, res);
			});

			app.get('/giving', function(req, res) {
				shared.setup_arg(req, res);

				res.render('mobile/lang/giving');
		    });
		});
	});
}

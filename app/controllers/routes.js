// All files should follow this structure
//
// http://url/lang/header/sidebar

/////////////////////////////////////////////////////////////////////////////
// pre-define function

var path = require('path');

var shared = require(path.join(__basedir, 'app/controllers/shared'));

/////////////////////////////////////////////////////////////////////////////
// Main routing

module.exports = function(app) {

	// Welcome page
	app.get('/', function(req, res) {
		// res.render('main/index');
		res.redirect('/eng/');
	});

}

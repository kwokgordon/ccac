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

	app.get('/privacy-policy', function(req, res) {
		res.redirect('https://drive.google.com/open?id=1ddSHxVAz9MNzMCuEgX2qR8obUdxfyBwryObHF3JrzMg');
	});

	app.get('/reopen-survey', function(req, res) {
		res.redirect('https://docs.google.com/forms/d/e/1FAIpQLSd8HbqW7IWwhGPVOSGmsiszgEsMpzZLdZCZ1XO5bqIGUd6Oww/viewform?usp=sf_link');
	})
}

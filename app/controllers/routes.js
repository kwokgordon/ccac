// All files should follow this structure
//
// http://url/lang/header/sidebar

// Argument index
var lang_arg = 1;
var header_arg = 2;
var sidebar_arg = 3;

String.prototype.cut = function() { 
	return this.replace(new RegExp('/' + "*$"),'').substring(4); 
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

/*
	console.log(req.path);
	console.log(arg.length);
	console.log(arg);
	console.log(arg[lang_arg]);
	console.log(arg[header_arg]);
	console.log(arg[sidebar_arg]);
*/
	req.setLocale(req.params.lang);
	
	res.locals.path = req.path.cut();
	res.locals.lang = req.params.lang;
	res.locals.header = (arg.length > header_arg) ? arg[header_arg]:"";
	res.locals.lg_lang = req.params.lg_lang;
	res.locals.sidebar = req.params.sidebar;
}

function fullpageRender(req, res) {
	setup_arg(req, res);
	
	res.render('lang/fullpage');
}

function sidepageRender(req, res) {
	setup_arg(req, res);
	
	res.render('lang/sidepage');
}

module.exports = function(app, transporter) {
	

	app.get('/', function(req, res) {
		res.render('main/index');
	});
		
	app.namespace('/:lang', function() {
		
		app.get('/', function(req, res) {
			fullpageRender(req, res);
		});

		app.get('/news', function(req, res) {
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
				
		app.get('/events', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/events');
		});
		
		app.get('/resources', function(req, res) {
			setup_arg(req, res);
			
			res.render('lang/resources');
		});

		// Contact Us send email
		app.post('/send_email', function(req, res) {
		
			var mailOptions = {
				from: req.body.from,
				to: req.body.to,
				subject: req.body.subject,
				text: req.body.message
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


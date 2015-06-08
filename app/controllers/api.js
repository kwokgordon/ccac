var path = require('path');
var configSecret = require(path.join(__basedir, 'config/secret.js'));
var http_auth = require('http-auth');

var Sermon = require(path.join(__basedir, 'app/models/sermons'));

var basic = http_auth.basic({
		realm: configSecret.http_auth.secret
	}, function(username, password, callback) {
		callback(username == configSecret.http_auth.username && password == configSecret.http_auth.password);
});

var auth = http_auth.connect(basic);

/////////////////////////////////////////////////////////////////////////////
// routing

module.exports = function(app) {

	// API
	app.namespace('/api', function() {

		app.get('/aws_key', auth, function(req, res) {
			res.json({
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_KEY			
			});
		});
	
		app.post('/getSermons', function(req, res) {
			var congregation = req.body.congregation;
			var last = { sermon_date: '9999' };
			var limit = 10;
			
			if(req.body.last) 
				last = req.body.last;
			
			if(req.body.limit) 
				limit = req.body.limit;
				
			Sermon.find({congregation: congregation, sermon_date: { $lt: last.sermon_date }}, {}, {sort: {sermon_date:-1}, limit: limit}, function(err, sermons) {
				if (err)
					res.send(err);
				
				res.json(sermons);
			});
		});

		app.post('/updateSermon', function(req, res) {
			var congregation = req.body.congregation;
			var sermon_date = req.body.sermon_date;
								
			Sermon.findOne({congregation: congregation, sermon_date: sermon_date}, function(err, sermon) {
				if (err)
					res.send(err);
					
				if(sermon) {
					for(var x in req.body) {
						if(x == "insert") {
							if(sermon.insert == undefined)
							sermon.insert.push(req.body.insert);
						}
						else {
							sermon[x] = req.body[x];
						}
					}
					
					sermon.save();

					res.json(sermon);
				} else {
					create_docs(req, res);
				}
			});
		});

		app.get('/getBulletin/:congregation', function(req, res) {
			var congregation = req.params.congregation;
			
			Sermon.findOne({congregation: congregation, bulletin: {$exists:true} }, {}, {sort: {sermon_date:-1}}, function(err, sermon) {
				if (err)
					res.send(err);
				
				if(sermon)
					res.redirect(sermon.bulletin);
				else
					res.send("No file found");
			});
		});
		
	});

}

function create_docs(req, res) {
	Sermon.create({
		congregation: req.body.congregation,
		sermon_date: req.body.sermon_date,
		title: req.body.title,
		sermon: req.body.sermon,
		bulletin: req.body.bulletin,
		life_group: req.body.life_group,
		ppt: req.body.ppt
	}, function(err, sermon) {
		if (err)
			res.send(err)
			
		if(req.body.insert != undefined) {
			sermon.insert.push(req.body.insert);
			sermon.save();
		}

		res.json(sermon);
	});
}
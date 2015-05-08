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
			
			Sermon.find({congregation: congregation}, function(err, sermons) {
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
							sermon.insert.push(req.body[x]);
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
		ppt: req.body.ppt,
		insert: [req.body.insert]
	}, function(err, sermon) {
		if (err)
			res.send(err)

		res.json(sermon);
	});
}

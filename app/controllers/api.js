var path = require('path');

var Sermon = require(path.join(__basedir, 'app/models/sermon'));

/////////////////////////////////////////////////////////////////////////////
// routing

module.exports = function(app) {

	// API
	app.namespace('/api', function() {

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

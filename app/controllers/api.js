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
				limit = parseInt(req.body.limit);
				
			Sermon.find({congregation: congregation, sermon_date: { $lt: last.sermon_date }}, {}, {sort: {sermon_date:-1}, limit: limit}, function(err, sermons) {
				if (err)
					res.send(err);
				
				res.json(sermons);
			});
		});

		app.get('/getSermons/:congregation', function(req, res) {
			var congregation = req.params.congregation;
			var last = { sermon_date: '9999' };
			var limit = 10;
			
			console.log(req.query);

			if(req.query.last) 
				last = { sermon_date: req.query.last };
			
			if(req.query.limit) 
				limit = parseInt(req.query.limit);
				
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

		app.get('/getBulletins', function(req, res) {

/*
			Sermon.aggregate(
				[
					{ "$group": { 
						"_id": "$congregation",
						"sermon_date": { "$max": "$sermon_date" },
					}},
				],
				function(err, result) {
					if (err)
						res.send(err);

					for(var i = 0; i < result.length; i++ ) {
						result[i]['congregation'] = result[i]._id;
					}
																																																																						
					res.send(result);
				}
			);
*/

			var data = [];
			Sermon.findOne({ 'congregation': 'English' }, null, { sort: { 'sermon_date': -1 }},
				function(err, eng_result) {
					if (err)
						res.send(err);

					data.push(eng_result);

					Sermon.findOne({ 'congregation': 'Cantonese' }, null, { sort: { 'sermon_date': -1 }},
						function(err, can_result) {
							if (err)
								res.send(err);

							data.push(can_result);

							Sermon.findOne({ 'congregation': 'Mandarin' }, null, { sort: { 'sermon_date': -1 }},
								function(err, man_result) {
									if (err)
										res.send(err);

									data.push(man_result);

									res.send(data);
								});
						});
				});
		});
		
	});

}

var mongoose = require('mongoose');

var sermonSchema = mongoose.Schema({

	congregation: String,
	sermon_date: String,
	title: String,
	sermon: String,
	bulletin: String,
	life_group: String,
	ppt: String,
	insert: [String]
});

module.exports = mongoose.model('Sermon', sermonSchema);

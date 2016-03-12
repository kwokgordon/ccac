var mongoose = require('mongoose');

var pagesSchema = mongoose.Schema({

	path: String,
	eng: {
		lang_path: String,
		doc_id: String,
	},
	cht: {
		lang_path: String,
		doc_id: String,
	},
	chs: {
		lang_path: String,
		doc_id: String,
	},
	google_calendar: String
});

module.exports = mongoose.model('Page', pagesSchema);

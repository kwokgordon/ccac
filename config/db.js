var development = {
	'db' : {
		'mongo': 'mongodb://ccac:ccac@52.42.78.163:27017/CCAC_DEV'
	}
};

var production = {
	'db' : {
		'mongo': 'mongodb://ccac:ccac@52.42.78.163:27017/CCAC'
	}
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;

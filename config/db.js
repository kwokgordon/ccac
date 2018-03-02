var development = {
	'db' : {
		'mongo': 'mongodb://52.32.254.39:27017/CCAC_DEV'
	}
};

var production = {
	'db' : {
		'mongo': 'mongodb://52.32.254.39:27017/CCAC'
	}
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;

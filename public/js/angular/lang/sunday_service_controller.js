var ccac = angular.module('ccacApp', ['ui.bootstrap']);

ccac.controller('SundayServiceController', function ($scope, $http, SermonListService, $log) {

	$scope.tabs = [
		{ title:'English', content:'english' },
		{ title:'Cantonese', content:'cantonese' },
		{ title:'Mandarin', content:'mandarin' }
	];

	$scope.formData = {};
	
	$scope.sermon_list = SermonListService.getSermonList();

	$scope.getSermon = function() {
		AWS.config.update({ accessKeyId: $scope.s3_access_key, secretAccessKey: 'UA5utWjUmzoy2hYH5WC+ga0mPE0V3eOjyAGxDXSL' });
		AWS.config.region = $scope.s3_region;
		var bucket = new AWS.S3({ params: { Bucket: $scope.s3_bucket } });

		var params = { 
		};
	
		bucket.listObjects(params, function(err, data) {
			if(err) {
				$log.info(err, err.stack);
			}
			else {
				$log.info(data);
				for(var i = 0; i < data.Contents.length; i++) {
					$log.info(data.Contents[i].Key);
				}
				
				var arr = sortByKeyDesc(data.Contents, 'Key');
				$log.info(arr);
				for(var i = 0; i < arr.length; i++) {
					$log.info(arr[i].Key);
				}
				
			}
		})
	};
	
	$scope.test = function() {
		$scope.sermon_list = SermonListService.getSermonList();
		$log.info($scope.sermon_list);

		AWS.config.update({ accessKeyId: $scope.s3_access_key, secretAccessKey: 'UA5utWjUmzoy2hYH5WC+ga0mPE0V3eOjyAGxDXSL' });
		AWS.config.region = $scope.s3_region;
		var bucket = new AWS.S3({ params: { Bucket: $scope.s3_bucket } });

/*
		var params = {
			Bucket: 'STRING_VALUE', //required
			Delimiter: 'STRING_VALUE',
			EncodingType: 'url',
			Marker: 'STRING_VALUE',
			MaxKeys: 0,
			Prefix: 'STRING_VALUE'
		};

		s3.listObjects(params, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else     console.log(data);           // successful response
		});	
*/
		
		var params = { 
		};
	
		bucket.listObjects(params, function(err, data) {
			if(err) {
				$log.info(err, err.stack);
			}
			else {
				$log.info(data);
				for(var i = 0; i < data.Contents.length; i++) {
					$log.info(data.Contents[i].Key);
				}
				
				var arr = sortByKeyDesc(data.Contents, 'Key');
				$log.info(arr);
				for(var i = 0; i < arr.length; i++) {
					$log.info(arr[i].Key);
				}
				
			}
		})
	};
})
.service('SermonListService', function($http, $log){

	this.getSermonList = function() {
		$http.get('/api/getSermonList')
			.success(function(data, status, headers, config) {
				$log.info("service success");
				$log.info(data);
				$log.info(status);
				$log.info(headers);
				$log.info(config);
				return data;
			})
			.error(function(data, status, headers, config) {
				$log.info("service error");
				return { error: "Error calling /api/getSermonList" };
			});
	}
 
});

////////////////////////////////////////////////////////////////////////
// Other functions

function sortByKeyDesc(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string")
        {
            x = x.toLowerCase(); 
            y = y.toLowerCase();
        }

        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}
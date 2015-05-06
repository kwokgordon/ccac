var ccac = angular.module('ccacApp', ['ui.bootstrap']);

ccac.controller('CCACController', function ($scope, $http, $log) {

	$scope.formData = {};
	
	$scope.s3_id = '';
	$scope.s3_key = '';
	
	$scope.title = '';
	$scope.key = {
		title: 'title',
		sermon: '',
		bulletin: '',
		life_group: '',
		ppt: '',
		insert1: '',
		insert2: '',
		insert3: '',
		insert4: '',
		insert5: ''
	};

	$scope.congregations = ['English', 'Cantonese', 'Mandarin'];
	$scope.congregation = $scope.congregations[0];	
	$scope.dt = null;

	$scope.progress_value = 0;	

	$scope.open_calendar = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 0
	};
	
	$scope.creds = {
		access_key: $scope.s3_id,
		secret_key: $scope.s3_key,
		bucket: 'calgarychinesealliancechurch',
		region: 'us-west-2'
	}
 
	$scope.upload = function(str) {
		// Configure The S3 Object 
//		AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
		AWS.config.region = $scope.creds.region;
		var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

		if(!$scope.dt) {
			// No Date Selected
			alert('No Date Selected');
			return;
		}

		if($scope[str]) {
			var params = { 
				ACL: "public-read",
				Key: $scope.key[str].createKey($scope.congregation, $scope.dt.yyyymmdd(), str),
				ContentType: $scope[str].type, 
				Body: $scope[str] 
//					ServerSideEncryption: 'AES256' 
			};
		
			bucket.putObject(params, function(err, data) {
				if(err) {
					// There Was An Error With Your S3 Config
					alert(err.message);
					return false;
				}
				else {
					// Success!
					alert('Upload Done');
				}
			})
			.on('httpUploadProgress',function(progress) {
				// Log Progress Information
				$scope.progress_value = Math.round(progress.loaded / progress.total * 100);
				$scope.$apply();

			});
		}
		else {
			// No File Selected
			alert('No File Selected');
		}
	}	

	$scope.upload_all = function() {
		if(!$scope.dt) {
			// No Date Selected
			alert('No Date Selected');
			return;
		}

		var temp_array = ["title","sermon","bulletin","life_group","ppt","insert1","insert2","insert3","insert4","insert5"];

		for(var i = 0; i < temp_array.length; i++) {
			var str = temp_array[i];
			
			if($scope[str]) {
				$scope.upload(str);
			}
		}
	}

	$scope.pull_logs = function() {
		$log.info($scope);
	}
})
.directive('file', function() {
	return {
		restrict: 'AE',
		scope: {
			file: '@',
			filetype: '@'
		},
		link: function(scope, el, attrs){
			el.bind('change', function(event){

				var files = event.target.files;
				var file = files[0];

				scope.file = file;
				scope.$parent.file = file;
				scope.$parent.filetype = scope.filetype;
				scope.$parent[scope.filetype] = scope.file;
				scope.$parent.key[scope.filetype] = scope.file.name;
				scope.$apply();
			});
		}
	};
});

/////////////////////////////////////////////////////////////////////////////
// Other prototype
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

String.prototype.createKey = function(congregation, date_string, file_type) {
	return "SundayService/" + congregation + "/" + date_string + "/" + file_type + "/" + this
	
}
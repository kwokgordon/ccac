var ccac = angular.module('ccacApp', ['ui.bootstrap']);

ccac.controller('CCACController', function ($scope, $http, $log) {

	$scope.formData = {};
	
	$scope.key = {
		title: 'title',
		sermon: '',
		bulletin: '',
		life_group: '',
		ppt: '',
		insert: ''
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

	$scope.upload = function(str) {
		$http.get('/api/aws_key')
			.success(function(data) {
				// Configure The S3 Object 
				AWS.config.update({ accessKeyId: data.accessKeyId, secretAccessKey: data.secretAccessKey });
				AWS.config.region = $scope.s3_region;
				var bucket = new AWS.S3({ params: { Bucket: $scope.s3_bucket } });

				if(!$scope.dt) {
					// No Date Selected
					alert('No Date Selected');
					return;
				}
				
				if($scope[str]) {
					if(str == "title") {
						$scope.formData = {
							congregation: $scope.congregation,
							sermon_date: $scope.dt.yyyymmdd(),
							title: $scope[str] 
						};
											
						$http.post('/api/updateSermon', $scope.formData)
							.success(function(data) {
								$log.info(data);
							})
							.error(function(data) {
								$log.info('Error: ' + data);
							});		

						// Success!
						alert('Upload Done');
						return;	
					}
	
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
							$scope.formData = {
								congregation: $scope.congregation,
								sermon_date: $scope.dt.yyyymmdd()
							};
							
							$scope.formData[str] = "https://s3-us-west-2.amazonaws.com/calgarychinesealliancechurch/" + params.Key;
							
							$http.post('/api/updateSermon', $scope.formData)
								.success(function(data) {
									$log.info(data);
								})
								.error(function(data) {
									$log.info('Error: ' + data);
								});		

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
			})
			.error(function(data) {
				$log.info('Error: ' + data);
			});		
	}	

	$scope.upload_all = function() {
		if(!$scope.dt) {
			// No Date Selected
			alert('No Date Selected');
			return;
		}

		var temp_array = ["title","sermon","bulletin","life_group","ppt","insert"];

		for(var i = 0; i < temp_array.length; i++) {
			var str = temp_array[i];
			
			if($scope[str]) {
				$scope.upload(str);
			}
		}
	}

	$scope.pull_logs = function() {
		$log.info($scope);

		$http.get('/api/aws_key')
			.success(function(data) {
				$log.info(data);
			})
			.error(function(data) {
				$log.info('Error: ' + data);
			});		
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
	return "SundayService/" + congregation + "/" + date_string + "/" + file_type + "/" + this;	
};
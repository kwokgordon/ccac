var ccac = angular.module('ccacApp', ['ui.bootstrap', 'infinite-scroll']);

ccac.controller('SundayServiceController', function ($scope, $http, $modal, $log) {

	$scope.oneAtATime = true;
	$scope.sermons = [];
	$scope.loading_api = false;
	$scope.no_more_result = false;

	$scope.tabs = [
		{ title:'English', lang:'eng', id: 'english' },
		{ title:'Cantonese', lang:'cht', id: 'cantonese' },
		{ title:'Mandarin', lang:'chs', id: 'mandarin' }
	];

	$scope.formData = {};

	$scope.init = function() {
		$scope.loading_api = false;
		
		for(i = 0; i < $scope.tabs.length; i++) {
			if($scope.congregation == undefined || $scope.congregation == 'undefined') {
				if($scope.lang == $scope.tabs[i].lang) {
					$scope.tabs[i].active = true;
					$scope.getSermons($scope.tabs[i].title);
				}
			} else {
				if($scope.congregation == $scope.tabs[i].id) {
					$scope.tabs[i].active = true;
					$scope.getSermons($scope.tabs[i].title);
				}
			}
		}
		
		if($scope.id != undefined && $scope.id != 'undefined') {
			$http.post('/api/shareLinkSermon', {congregation: $scope.congregation, id : $scope.id})
				.success(function(data) {
					$log.info(data);
					
					$scope.sermon = data;
					
					$scope.openSermon($scope.sermon);
				})
				.error(function(data) {
					$log.info("Error: " + data);
				});
		}
	};

	$scope.getSermons = function(congregation) {
		$scope.congregation = congregation;
		$scope.loading_api = true;

		$http.post('/api/getSermons', {congregation: $scope.congregation, limit: 10})
			.success(function(data) {
				$log.info(data);
				
				if(data.length == 0) {
					$scope.no_more_result = true;
				} else {
					$scope.no_more_result = false;
					$scope.sermons = data;
				}

				$scope.loading_api = false;
			})
			.error(function(data) {
				$log.info("Error: " + data);
				$scope.loading_api = false;
			});
	};

	$scope.infiniteScroll = function() {
		if($scope.loading_api || $scope.no_more_result) return;

		$scope.loading_api = true;

		$http.post('/api/getSermons', {congregation: $scope.congregation, last: $scope.sermons[$scope.sermons.length-1], limit: 10})
			.success(function(data) {
				$log.info(data);
				
				if(data.length == 0) {
					$scope.no_more_result = true;
				} else {
					$scope.no_more_result = false;
					
					for(var i = 0; i < data.length; i++)
						$scope.sermons.push(data[i]);
				}

				$scope.loading_api = false;
			})
			.error(function(data) {
				$log.info("Error: " + data);
				$scope.loading_api = false;
			});
	};
	
	$scope.openAudio = function(sermon) {

		var audioModalInstance = $modal.open({
			templateUrl: '/ng-template/lang/audioModal.html',
			controller: 'AudioModalController',
			resolve: {
				sermon: function() {
					return sermon;
				}
			}
		});
	}

	$scope.openDocs = function(sermon, file) {

		var docsModalInstance = $modal.open({
			templateUrl: '/ng-template/lang/docsModal.html',
			controller: 'DocsModalController',
			windowClass: 'full-size-modal',
			resolve: {
				sermon: function() {
					return sermon;
				},
				file: function() {
					return file;
				}
			}
		});
	}

	$scope.openLink = function(sermon) {

		var linkModalInstance = $modal.open({
			templateUrl: '/ng-template/lang/linkModal.html',
			controller: 'LinkModalController',
			resolve: {
				sermon: function() {
					return sermon;
				}
			}
		});
	}

	$scope.openSermon = function(sermon) {

		var sermonModalInstance = $modal.open({
			templateUrl: '/ng-template/lang/sermonModal.html',
			controller: 'SermonModalController',
			resolve: {
				sermon: function() {
					return sermon;
				},
				openAudio: function() {
					return $scope.openAudio;
				},
				openDocs: function() {
					return $scope.openDocs;
				}
			}
		});
	}
	
})
.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from outer templates domain.
		'https://docs.google.com/document/d/**',
		'https://www.google.com/calendar/**',
		'https://s3-us-west-2.amazonaws.com/**'
	]); 
});

ccac.controller('AudioModalController', function($scope, $modalInstance, sermon) {
	$scope.sermon = sermon;

	$scope.close = function () {
		$modalInstance.dismiss('close');
	};	
});

ccac.controller('DocsModalController', function($scope, $modalInstance, sermon, file) {
	$scope.sermon = sermon;
	$scope.file = file;
	
	if(sermon[file].split('.').pop() == 'pdf') {
		$scope.src = sermon[file];
	}
	else {
		$scope.src = "http://docs.google.com/gview?url=" + sermon[file] + "&embedded=true";
	}
	
	$scope.close = function () {
		$modalInstance.dismiss('close');
	};	
});

ccac.controller('LinkModalController', function($scope, $modalInstance, sermon) {
	$scope.sermon = sermon;

	$scope.close = function () {
		$modalInstance.dismiss('close');
	};	
});

ccac.controller('SermonModalController', function($scope, $modalInstance, sermon, openAudio, openDocs) {
	$scope.sermon = sermon;
	$scope.openAudio = openAudio;
	$scope.openDocs = openDocs;

	
	$scope.close = function () {
		$modalInstance.dismiss('close');
	};	
});

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
				if($scope.congregation == $scope.tabs[i].tag) {
					$scope.tabs[i].active = true;
					$scope.getSermons($scope.tabs[i].title);
				}
			}
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
//			templateUrl: 'audioModal.html',
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
//			templateUrl: 'docsModal.html',
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
	
})
.config(function($sceProvider) {
	// Completely disable SCE.  For demonstration purposes only!
	// Do not use in new projects.
	$sceProvider.enabled(false);
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

//var ccac = angular.module('ccacApp', ['ui.bootstrap', 'ngRoute', 'i18n']);

//ccac.controller('SundayServiceController', function ($scope, $http, $log, i18n) {

var ccac = angular.module('ccacApp', ['ui.bootstrap', 'ngRoute']);

ccac.controller('SundayServiceController', function ($scope, $http, $log) {

	$scope.oneAtATime = true;

	$scope.tabs = [
		{ title:'English', lang:'eng' },
		{ title:'Cantonese', lang:'cht' },
		{ title:'Mandarin', lang:'chs' }
	];

	$scope.formData = {};

	$scope.init = function() {
		var tab;
		for(i = 0; i < $scope.tabs.length; i++) {
			if($scope.lang == $scope.tabs[i].lang) {
				tab = $scope.tabs[i];
				$scope.tabs[i].active = true;
			}
		}

		$http.post('/api/getSermons', {congregation: tab.title})
			.success(function(data) {
				$log.info(data);
				$scope.sermons = data;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};
		
	$scope.getSermons = function(congregation) {
		$http.post('/api/getSermons', {congregation: congregation})
			.success(function(data) {
				$log.info(data);
				$scope.sermons = data;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};
	
})
.config(function($sceProvider) {
	// Completely disable SCE.  For demonstration purposes only!
	// Do not use in new projects.
	$sceProvider.enabled(false);
});


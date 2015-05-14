var ccac = angular.module('ccacApp', ['ui.bootstrap', 'ngRoute', 'i18n']);

ccac.controller('SundayServiceController', function ($scope, $http, $log, i18n) {

	$scope.oneAtATime = true;
	$scope.i18n = i18n;

	$scope.tabs = [
		{ title:'English', lang:'eng', tag: 'english' },
		{ title:'Cantonese', lang:'cht', tag: 'cantonese' },
		{ title:'Mandarin', lang:'chs', tag: 'mandarin' }
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

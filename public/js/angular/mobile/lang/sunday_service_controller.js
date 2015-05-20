var ccac = angular.module('ccacApp', ['mobile-angular-ui', 'ngRoute', 'i18n']);

ccac.controller('SundayServiceController', function ($scope, $http, $log, i18n) {

	$scope.i18n = i18n;

	$scope.formData = {};
		
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


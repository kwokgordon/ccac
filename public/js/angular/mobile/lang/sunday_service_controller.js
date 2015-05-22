var ccac = angular.module('ccacApp', ['ui.bootstrap', 'ngRoute', 'i18n']);

//var ccac = angular.module('ccacApp', ['mobile-angular-ui', 'ngRoute', 'i18n']);

ccac.controller('SundayServiceController', function ($scope, $http, $modal, $log, i18n) {

	$scope.oneAtATime = true;

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

	$scope.openAudio = function(sermon) {

		var audioModalInstance = $modal.open({
			templateUrl: 'audioModal.html',
			controller: 'AudioModalController',
			resolve: {
				sermon: function() {
					return sermon;
				}
			}
		});
	}

	$scope.openDocs = function(sermon) {

		var docsModalInstance = $modal.open({
			templateUrl: 'docsModal.html',
			controller: 'DocsModalController',
			windowClass: 'full-size-modal',
			resolve: {
				sermon: function() {
					return sermon;
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

ccac.controller('DocsModalController', function($scope, $modalInstance, sermon) {
	$scope.sermon = sermon;
	
	$scope.close = function () {
		$modalInstance.dismiss('close');
	};	
});

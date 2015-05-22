var ccac = angular.module('ccacApp', ['ui.bootstrap', 'ngRoute', 'i18n']);

ccac.controller('SundayServiceController', function ($scope, $http, $modal, $log) {

	$scope.oneAtATime = true;

	$scope.tabs = [
		{ title:'English', lang:'eng', tag: 'english' },
		{ title:'Cantonese', lang:'cht', tag: 'cantonese' },
		{ title:'Mandarin', lang:'chs', tag: 'mandarin' }
	];

	$scope.formData = {};

	$scope.init = function() {
		
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
		$http.post('/api/getSermons', {congregation: congregation})
			.success(function(data) {
				$log.info(data);
				$scope.data = data;
				$scope.sermons = data;

				$scope.totalItems = data.length;
				$scope.itemsPerPage = 10;
				$scope.currentPage = 1;
				
//				$scope.setPage();
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};

	$scope.pageChanged = function() {
		$log.info('Page changed to : ' + $scope.currentPage);
	}

	$scope.$watch( $scope.currentPage, $scope.setPage );

	$scope.setPage = function() {
		var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
		var end = begin + $scope.itemsPerPage;
		
		$scope.sermons = $scope.data.slice(begin, end);
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

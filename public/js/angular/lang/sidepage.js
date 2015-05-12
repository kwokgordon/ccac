var ccac = angular.module('ccacApp', ['ui.bootstrap']);

ccac.controller('SidepageController', function ($scope, $http, $log) {

	$scope.tabs = [];
	$scope.url = '';

	$scope.init = function() {

		$scope.tabs.push({ title: 'Content', id: 'content', body: $scope.content });
		
		if($scope.calendar != 'null') {
			$scope.tabs.push({ title: 'Calendar', id: 'calendar', body: $scope.calendar });
		}
		
		$scope.url = "https://docs.google.com/document/d/" + $scope.content + "/pub?embedded=true";
	};

	$scope.tabClick = function(id) {
	};
})
.config(function($sceProvider) {
	// Completely disable SCE.  For demonstration purposes only!
	// Do not use in new projects.
	$sceProvider.enabled(false);
});

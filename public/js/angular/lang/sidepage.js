var ccac = angular.module('ccacApp', ['ui.bootstrap']);

ccac.controller('SidepageController', function ($scope, $http, $log, $sce) {

	$scope.tabs = [];
	$scope.url = '';
	$scope.calendar_url = '';

	$scope.init = function() {

		$scope.tabs.push({ title: 'Content', id: 'content', body: $scope.content });
		
		if($scope.calendar != 'null') {
			$scope.tabs.push({ title: 'Calendar', id: 'calendar', body: $scope.calendar });
		}
		
		$scope.url = "https://docs.google.com/document/d/" + $scope.content + "/pub?embedded=true";
		$scope.calendar_url = "https://www.google.com/calendar/embed?showTitle=0&wkst=1&hl=en&bgcolor=%23FFFFFF&src=" + $scope.calendar + "&ctz=America/Edmonton";

	};

})
.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from outer templates domain.
		'https://docs.google.com/document/d/**',
		'https://www.google.com/calendar/**',
		'http://church-update.calgarychinesealliance.org/**',
		'https://s3-us-west-2.amazonaws.com/**',
	]); 
});


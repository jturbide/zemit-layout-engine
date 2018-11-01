(function() {
	Zemit.app.directive('zmObject', ['$compile', function($compile) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				object: '='
			},
			templateUrl: 'core/directives/object/object.html',
			link: function ($s, $e, attrs) {
				
				$e.html('<' + $s.object.directive + ' object="object"></' + $s.object.directive + '>');
				$compile($e.contents())($s);
			}
		};
	}]);
})();
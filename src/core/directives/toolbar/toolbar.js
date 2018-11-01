(function() {
	
	Zemit.app.run(['$object', function($object) {
		$object.register('toolbar', 'zm-toolbar');
		$object.register('sep', 'zm-separator');
	}]);
	
	Zemit.app.directive('zmToolbar', [function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				object: '='
			},
			templateUrl: 'core/directives/toolbar/toolbar.html',
			link: function ($s, $e, attrs) {
				
				$s.sections = {
					top: ['left', 'middle', 'right'],
					bottom: ['left', 'right']
				};
			}
		};
	}]);
})();
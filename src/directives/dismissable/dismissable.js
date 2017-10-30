/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.directive("zmDismissable", ['$config', function($config) {
		return {
			restrict: 'E',
			templateUrl: 'directives/dismissable/dismissable.html',
			transclude: true,
			link: function ($s, $e, attrs) {
				
				var config = $config.get();
				$config.prepare({
					directives: {
						dismissable: {
							visible: true
						}
					}
				});
				
				$s.config = config.directives.dismissable;
				$s.type = attrs.type;
				
				$s.close = function() {
					
					$s.config.visible = false;
					$e.remove();
				};
			}
		};
	}]);
})();
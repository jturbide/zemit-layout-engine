/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.directive("zmDismissable", ['$session', function($session) {
		return {
			restrict: 'E',
			templateUrl: 'directives/dismissable/dismissable.html',
			transclude: true,
			scope: true,
			link: function ($s, $e, attrs) {
				
				var session = $session.get();
				$session.prepare({
					directives: {
						dismissable: {
							visible: true
						}
					}
				});
				
				$s.session = session.directives.dismissable;
				$s.type = attrs.type;
				$s.locked = attrs.locked !== undefined;
				
				$s.close = function() {
					
					$s.session.visible = false;
				};
			}
		};
	}]);
})();
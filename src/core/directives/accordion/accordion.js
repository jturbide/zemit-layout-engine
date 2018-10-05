/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Accordion directive
	 */
	Zemit.app.directive('zmAccordion', [function() {
		return {
			restrict: "E",
			templateUrl: 'core/directives/accordion/accordion.html',
			replace: true,
			transclude: {
				header: '?header',
				content: '?content',
			},
			scope: {
				model: '=ngModel'
			},
			link: function ($s, $e, attrs) {
				
				$s.toggle = function() {
					
					$s.model = !$s.model;
					
					let $scrollContainer = $e.parents('.zm-scrollable-y:eq(0)');
					if($scrollContainer.length === 0) {
						$scrollContainer = angular.element('body');
					}
					
					let top = ($e.offset().top - $scrollContainer.offset().top);
					
					$scrollContainer.animate({
						scrollTop: top
					}, 250);
				};
			}
		};
	}]);
})();
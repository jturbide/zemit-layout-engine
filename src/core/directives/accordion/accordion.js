/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.run(['$object', function($object) {
		$object.register('accordion', 'zm-accordion');
	}]);
	
	/**
	 * Accordion directive
	 */
	Zemit.app.directive('zmAccordion', ['$timeout', function($timeout) {
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
					
					// Let zmSlide push the scrollable area first, then
					// animate..
					let top = ($e.offset().top - $scrollContainer.offset().top + $scrollContainer.scrollTop());
					// setTimeout(() => {
						$scrollContainer.animate({
							scrollTop: top
						}, 250);
					// }, 250);
				};
			}
		};
	}]);
})();
/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * iFrame directive
	 */
	Zemit.app.directive('iframe', ['$compile', function($compile) {
		return {
			restrict: "E",
			scope: true,
			link: function($s, $e, attrs) {
				
				$s.loading = true;
				
				var $container = angular.element('<div class="zm-iframe-container" />');
				var $loading = angular.element('<zm-loading visible="loading" />');
				
				$e.wrap($container);
				$e.before($loading);
				
				$e.addClass('zm-invisible');
				$e[0].onload = () => {
					$e.removeClass('zm-invisible');
					$s.loading = false;
					$s.$digest();
				};
				
				$s.$on('$destroy', () => {
					$container.remove();
				});
				
				$compile($loading)($s);
			}
		};
	}]);
})();
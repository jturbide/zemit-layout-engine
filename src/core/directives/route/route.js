Zemit.app.directive('zmRoute', ['$route', function($route) {
	return {
		restrict: 'E',
		replace: true,
		template: `
			<div class="zm-h100 zm-route_wrapper zm-route-{{ $route.getCurrentRouteName() }}">
				<div class="zm-route" ng-view>
				</div>
			</div>
		`,
		link: function ($s, $e, attrs) {
			
			$s.$route = $route;
		}
	};
}]);

Zemit.app.directive('zmPage', ['$route', function($route) {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: `
			<div class="zm-p-3 zm-flex-container zm-border-box zm-page" ng-transclude>
			</div>
		`,
		link: function ($s, $e, attrs) {
			
			$e.addClass('zm-page-' + $route.getCurrentRouteName());
			
			if(attrs.align === 'center') {
				 $e.addClass('zm-flex-align-center');
			}
			if(attrs.type === 'stretch') {
				 $e.addClass('zm-h100');
			}
		}
	};
}]);

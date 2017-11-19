/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Creates tabs
	 */
	Zemit.app.directive('zmTabs', [function() {
		return {
			restrict: "E",
			transclude: {
				toggle: '?toggle',
				items: 'items'
			},
			replace: true,
			scope: true,
			templateUrl: 'directives/tabs/tabs.html',
			link: function($s, $e, attrs, ctrl, transclude) {
				
				var tabs = {
					visible: false,
					toggle: function() {
						this.visible = !this.visible;
					},
					open: function() {
						this.visible = true;
					},
					close: function() {
						this.visible = false;
					}
				};
				
				$s.tabs = tabs;
				
				if(attrs.anchor) {
					$e.addClass('zm-tabs-anchor-' + attrs.anchor);
				}
			}
		};
	}]);
})();
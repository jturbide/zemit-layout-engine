/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Creates tabs
	 */
	Zemit.app.directive('zmTabs', ['$rootScope', '$timeout', '$compile', function($rs, $timeout, $compile) {
		return {
			restrict: "E",
			transclude: {
				toggle: '?toggle',
				items: 'items'
			},
			replace: true,
			scope: {
				ngDisabled: '='
			},
			templateUrl: 'core/directives/tabs/tabs.html',
			link: function($s, $e, attrs, ctrl, transclude) {
				
				var $list = $e.find('.zm-tabs-list');
				
				var tabs = {
					visible: false,
					toggle: function() {
						!this.visible
							? this.open()
							: this.close();
					},
					open: function() {
						
						$rs.$broadcast('documentClick');
						
						applyPosition();
						this.visible = true;
					},
					close: function() {
						
						this.visible = false;
					},
					clickInside: function() {
						$timeout(function() {
							if(attrs.zmTabsKeepOpen === undefined) {
								tabs.close();
							}
						});
					}
				};
				
				$s.tabs = tabs;
				
				var applyPosition = () => {
					
					let anchor = attrs.anchor ? attrs.anchor : 'top-left';
					let [y, x] = attrs.anchor.split('-');
					
					clearAnchors();
					$e.addClass('zm-tabs-anchor-' + anchor);
					
					let rect = $list[0].getBoundingClientRect();
					
					if(rect.right > window.innerWidth && rect.left > 0) {
						x = 'right';
					}
					else if(x === 'right') {
						// Everything was fine, just skip the condition
					}
					else if(rect.left > 0 && rect.right < window.innerWidth) {
						x = 'left';
					}
					
					if(rect.bottom > window.innerHeight && rect.top > 0) {
						y = 'bottom';
					}
					else if(y === 'bottom') {
						// Everything was fine, just skip the condition
					}
					else if(rect.top > 0 && rect.bottom < window.innerHeight) {
						y = 'top';
					}
					
					anchor = y + '-' + x;
					
					clearAnchors();
					$e.addClass('zm-tabs-anchor-' + anchor);
				};
				
				var clearAnchors = () => {
					
					let anchors = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
					anchors.forEach(anchor => {
						$e.removeClass('zm-tabs-anchor-' + anchor);
					});
				}
				
				$s.$watch('ngDisabled', (nv, ov) => {
					if(nv !== ov && nv) {
						tabs.close();
					}
				});
				
				$s.$on('documentClick', (scope, event) => {
					
					if(!tabs.visible) {
						return;
					}
					
					var $target = event && angular.element(event.target);
					if(!event || (!$target.is($e) && $target.closest($e).length === 0)) {
						tabs.close();
						event && $s.$digest();
					};
				});
			}
		};
	}]);
})();
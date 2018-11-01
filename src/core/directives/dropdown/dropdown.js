/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.run(['$object', function($object) {
		$object.register('dropdown', 'zm-dropdown');
	}]);
	
	/**
	 * Creates dropdown
	 */
	Zemit.app.directive('zmDropdown', ['$rootScope', '$timeout', '$compile', function($rs, $timeout, $compile) {
		return {
			restrict: "E",
			transclude: {
				toggle: '?toggle',
				content: 'content'
			},
			replace: true,
			scope: {
				ngDisabled: '='
			},
			templateUrl: 'core/directives/dropdown/dropdown.html',
			link: function($s, $e, attrs, ctrl, transclude) {
				
				var $content = $e.find('.zm-dropdown-content');
				
				var dropdown = {
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
						$rs.$broadcast('documentClick');
					}
				};
				
				$s.dropdown = dropdown;
				$s.style = attrs.style || 'button';
				$s.tooltip = attrs.tooltip;
				
				var applyPosition = () => {
					
					let anchor = attrs.anchor ? attrs.anchor : 'top-left';
					let [y, x] = attrs.anchor.split('-');
					
					if(!$e.hasClass('zm-dropdown-anchor-' + anchor)) {
						clearAnchors();
						$e.addClass('zm-dropdown-anchor-' + anchor);
					}
					
					let rect = $content[0].getBoundingClientRect();
					
					if(rect.right > window.innerWidth && rect.left > 0) {
						x = 'right';
					}
					else if(rect.left < 0) {
						x = 'left';
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
					else if(rect.top < 0) {
						y = 'top';
					}
					else if(y === 'bottom') {
						// Everything was fine, just skip the condition
					}
					else if(rect.top > 0 && rect.bottom < window.innerHeight) {
						y = 'top';
					}
					
					anchor = y + '-' + x;
					
					if(!$e.hasClass('zm-dropdown-anchor-' + anchor)) {
						clearAnchors();
						$e.addClass('zm-dropdown-anchor-' + anchor);
					}
				};
				
				var clearAnchors = () => {
					
					let anchors = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
					anchors.forEach(anchor => {
						$e.removeClass('zm-dropdown-anchor-' + anchor);
					});
				}
				
				$s.$watch('ngDisabled', (nv, ov) => {
					if(nv !== ov && nv) {
						dropdown.close();
					}
				});
				
				$s.$on('documentClick', (scope, event) => {
					
					if(!dropdown.visible) {
						return;
					}
					
					var $target = event && angular.element(event.target);
					if(!event || (!$target.is($e) && $target.closest($e).length === 0)) {
						dropdown.close();
						event && $s.$digest();
					};
				});
			}
		};
	}]);
	
	/**
	 * Dropdown link item
	 */
	Zemit.app.directive('zmDropdownLinkItem', ['$device', '$shortcut', function($device, $shortcut) {
		return {
			restrict: "E",
			replace: true,
			scope: {
				active: '=?',
				ngDisabled: '=?'
			},
			templateUrl: 'core/directives/dropdown/dropdown.link-item.html',
			link: function($s, $e, attrs) {
				
				$s.title = attrs.title;
				$s.icon = attrs.icon;
				$s.shortcut = attrs.shortcut;
				$s.href = attrs.href;
				
				$s.$device = $device;
				$s.$shortcut = $shortcut;
			}
		}
	}]);
})();
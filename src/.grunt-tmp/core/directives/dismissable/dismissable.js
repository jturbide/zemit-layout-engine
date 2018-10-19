/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.directive("zmDismissable", ['$session', '$modules', function($session, $modules) {
		return {
			restrict: 'E',
			templateUrl: 'core/directives/dismissable/dismissable.html',
			transclude: true,
			scope: {
				type: '@?',
				list: '=?'
			},
			link: function ($s, $e, attrs) {
				
				var settings = $session.get('settings');
				$session.prepare('settings', {
					directives: {
						dismissable: {
							visible: true
						}
					}
				});
				
				$s.type = attrs.type;
				$s.locked = attrs.locked !== undefined;
				$s.index = 0;
				$s.getIsVisible = () => {
					return $s.locked || settings.directives.dismissable.visible;
				};
				$s.$watch('settings.directives.dismissable.visible', (nv, ov) => {
					if(nv !== ov) {
						$s.isVisible = $s.getIsVisible();
					}
				});
				$s.isVisible = $s.getIsVisible();
				
				if($s.list) {
					
					$s.list.forEach((item) => {
						Object.assign(item, {
							type: 'info'
						});
					});
					
					$s.effectiveList = [];
					$s.getEffectiveList = () => {
						let items = [];
						$s.list.forEach((item) => {
							if(item.condition()) {
								items.push(item);
							}
						});
						$s.effectiveList = items;
						
						if($s.index >= $s.effectiveList.length) {
							$s.index = $s.effectiveList.length - 1;
						}
						
						if($s.index < 0) {
							$s.index = 0;
						}
						
						return items;
					};
				}
				
				$s.next = () => {
					
					$s.index++;
					if($s.index >= $s.effectiveList.length) {
						$s.index = 0;
					}
				};
				
				$s.getLabel = (item) => {
					if(item.label instanceof Function) {
						return item.label();
					}
					
					return item.label;
				};
				
				$s.close = function() {
					
					settings.directives.dismissable.visible = false;
				};
				
				$s.settings = settings;
			}
		};
	}]);
})();
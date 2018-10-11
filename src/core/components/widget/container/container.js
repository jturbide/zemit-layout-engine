/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Container widget
	 */
	Zemit.app.run(['$i18n', function($i18n) {
		
		// Initialize widget
		Zemit.widgets.register('core/components/widget/container');
		
		Zemit.widgets.init('container', {
			injectable: false,
			selectable: false,
			defaultTemplate: false,
			draggable: false,
			hoverable: false,
			tooltip: false,
			drop: {
				outside: {
					enabled: false,
				},
				inside: {
					enabled: true,
					accept: '*',
					decline: ['column']
				}
			},
			controller: function($s, $e, $di, attrs) {
				
				var $zm = $di.get('$zm');
				var $device = $di.get('$device');
				var $hook = $di.get('$hook');
				var $sessionWorkspace = $di.get('$sessionWorkspace');
				var $i18n = $di.get('$i18n');
				
				// Set container scopes
				$s.zm = $zm;
				$s.container = $s.widget;
				$s.segment = null;
				
				$hook.add('onSegmentLoad', segment => {
					$s.widget.childs = segment.data.content.childs;
				});
				
				// Add a placeholder element in the DOM next to the container
				var placeholder = document.createElement('div');
				placeholder.classList.add('zm-drop-placeholder');
				$e.find('.zm-container-scrollable').append(placeholder);
				$s.$placeholder = angular.element(placeholder);
				
				$s.notices = [{
					label: $i18n.get('core.components.widget.container.notices.numberColumn'),
					condition: () => {
						return $s.container.childs.length === 1 && $s.container.childs[0].type === 'row' && $s.container.childs[0].childs.length === 0;
					}
				}, {
					label: $i18n.get('core.components.widget.container.notices.openWidget'),
					condition: () => {
						return !$sessionWorkspace.isValid();
					}
				}, {
					label: $i18n.get('core.components.widget.container.notices.startAddingRow'),
					condition: () => {
						return $sessionWorkspace.isValid() && $sessionWorkspace.isValid() && $s.container.childs.length === 0;
					}
				}, {
					label: () => {
						if($device._isTouch && !$device._isPrecise) {
							return $i18n.get('core.components.widget.container.notices.taploopParent');
						}
						else if($device._isPrecise) {
							return $i18n.get('core.components.widget.container.notices.clickHoldDrag');
						}
					},
					condition: () => {
						return $zm.widget.totalSelected > 0 && !($s.container.childs.length === 1 && $s.container.childs[0].childs.length === 0);
					}
				}, {
					label: $i18n.get('core.components.widget.container.notices.standalone'),
					condition: () => {
						return !$device.isStandalone() && $device.isTouch();
					}
				}];
				
				// Add a row if no widget available
				// if($s.container.childs.length === 0) {
				// 	$s.container.addChild('row');
				// }
			}
		});
	}]);
})();
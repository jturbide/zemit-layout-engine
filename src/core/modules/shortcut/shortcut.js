/**
 * Zemit Shortcuts
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2018-01-12
 * 
 * Listen to keydown events
 */
(function() {
	Zemit.app.run(['$rootScope', '$zm', '$history', '$hook', '$modal', '$session', function($rs, $zm, $history, $hook, $modal, $session) {
		
		$hook.add('onReady', () => {
			
			var settings = $session.get('settings');
			
			$rs.$zemit.on('keydown', function(event) {
								
				let isInInput = (angular.element(event.target).is('input')
					|| angular.element(event.target).is('textarea')
					|| angular.element(event.target).is('[contenteditable]')
					);
					
				// Hack: If focus is in an input while switching context,
				// shortcuts stops to work. We need to leave the input first
				// using this trick.
				let resetFocus = () => {
					$rs.$zemit.find('[tabindex]:eq(0)').focus();
				};
					
				if(!event.altKey && isInInput) {
					return;
				}
				
				switch(event.which) {
					case 8: // Delete MAC
						if(event.metaKey) {
							$zm.action($zm.widget.removeAllSelected);
							$rs.$digest();
						}
						
						event.preventDefault();
						break;
					case 9: // Tab
					
						// TODO: Loop through widgets if one selected. Otherwise
						// do normal behaviour
					
						break;
					case 13: // Enter
						break;
					case 27: // ESC
						break;
					case 46: // Delete PC
						$zm.action($zm.widget.removeAllSelected);
						$rs.$digest();
						
						event.preventDefault();
						break;
					case 68: // D
						if(event.ctrlKey || event.metaKey) {
							$zm.action($zm.widget.duplicate);
							$rs.$digest();
							event.preventDefault();
						}
						// if(event.altKey) {
						// 	settings.context = 'design';
						// 	$rs.$digest();
						// 	event.preventDefault();
						// }
						break;
					case 69: // E
						if(event.ctrlKey || event.metaKey) {
							// TODO: DEFAULT ACTION
							$rs.$digest();
							
							event.preventDefault();
						}
						break;
					case 75: // K
						if(event.ctrlKey || event.metaKey) {
							$zm.content.clear();
							$rs.$digest();
							
							event.preventDefault();
						}
						break;
					case 78: // N
						if(event.ctrlKey || event.metaKey) {
							// TODO: NEW SEGMENT
							$rs.$digest();
							
							event.preventDefault();
						}
						break;
					case 80: // P
						if(event.altKey) {
							resetFocus();
							let oldContext = settings.context;
							settings.context = 'preview';
							$hook.run('onContextChange', 'preview', oldContext);
							$rs.$digest();
							
							event.preventDefault();
						}
						break;
					case 83: // S
						if(event.ctrlKey || event.metaKey) {
							event.preventDefault();
							// TODO: SAVE CONTENT
							$rs.$apply();
							
							event.preventDefault();
						}
						if(event.altKey) {
							resetFocus();
							let oldContext = settings.context;
							settings.context = 'structure';
							$hook.run('onContextChange', 'structure', oldContext);
							$rs.$digest();
							
							event.preventDefault();
						}
						break;
					case 89: // Y
						if(event.ctrlKey || event.metaKey) {
							event.preventDefault();
							$history.redo();
							$rs.$apply();
							
							event.preventDefault();
						}
						break;
					case 90: // Z
						if(event.ctrlKey || event.metaKey) {
							event.preventDefault();
							$history.undo();
							$rs.$apply();
							
							event.preventDefault();
						}
						break;
					case 112: // F1
						$modal.open('doc')
						event.preventDefault();
						break;
				}
			});
		});
	}]);
})();
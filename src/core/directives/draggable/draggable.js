/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Draggable initialization
	 */
	Zemit.app.run(['$debug', '$hook', '$i18n', function($debug, $hook, $i18n) {
		$hook.add('onReady', () => $debug.init('draggable', $i18n.get('core.directives.draggable.debugTitle')));
	}]);
	
	/**
	 * Draggable directive
	 */
	Zemit.app.directive('zmDraggable', ['$device', '$debug', function($device, $debug) {
		return {
			restrict: 'A',
			scope: {
				options: '=zmDraggable',
				item: '=zmDraggableItem'
			},
			link: function ($s, $e, attrs) {
				
				var draggableOptions = {
					holdDuration: 200,
					manualStart: true,
					restrict: {
						endOnly: true,
						elementRect: {
							top: 0,
							left: 0,
							bottom: 1,
							right: 1
						}
					},
					autoScroll: {
						container: $s.options.container,
					},
					onmove: function(event) {
						
						if(!event.interaction.isReady) {
							return;
						}
						
						$debug.log('draggable', 'MOVE', event);
						
						if(event.interaction.interacting()) {
					    	event.preventDefault();
					    }
					    
						var target = event.interaction.$element[0],
							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
							y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
						var $element = event.interaction.$element;
						
						// translate the element
						$element.css({
							top: y + 'px',
							left: x + 'px'
						});
					
						// Update the position attributes
						target.setAttribute('data-x', x);
						target.setAttribute('data-y', y);
						
						var element = document.elementFromPoint(
							event.clientX,
							event.clientY
						);
						
						angular.element(element).trigger('dragHoverTouch', {
							x: event.clientX,
							y: event.clientY
						});
						
						event.stopPropagation();
					},
					onend: function(event) {
						
						$debug.log('draggable', 'END', event);
						
						var target = event.interaction.$element[0];
						var $element = event.interaction.$element;
						
						// Reset widget position
						$element.css({
							top: '',
							left: '',
							width: '',
							height: ''
						});
						target.removeAttribute('data-x');
						target.removeAttribute('data-y');
						
						$s.options.onEnd && $s.options.onEnd();
						
						event.interaction.$element.remove();
						$element.remove();
					}
				};
				
				var onStart = function(event) {
					
					$debug.log('draggable', 'START', event);
					
					event.interaction.dontRemove = true;
					event.interaction.dropState = {
						position: null,
						part: null,
						widget: null
					};
					
					var $clone = angular.element($e[0].cloneNode(true));
					$clone.addClass('zm-draggable-dragged-item');
					document.body.appendChild($clone[0]);
					event.interaction.$element = $clone;
					
					// Set dragged widget
					$clone[0].setAttribute('data-y', $e.offset().top);
					$clone[0].setAttribute('data-x', $e.offset().left);
					$clone.css({
						'top': $e.offset().top + 'px',
						'left': $e.offset().left + 'px',
						'width': $e.width(),
						'height': $e.height()
					});
					
					event.interaction.draggedItem = angular.copy($s.item);
					event.interaction.isReady = true;
					
					return $clone;
				}
				
				/**
				 * Move the element around
				 */
				var manualStart = function(event) {
					var interaction = event.interaction;
						
					if (interaction.pointerIsDown && !interaction.interacting()) {
						
						$device.isTouch() && $device.vibrate();
						var $clone = onStart(event);
						
						// If in portrait mode, close all sidebar tabs
						$s.options.onBeforeStart && $s.options.onBeforeStart(event);
						
						$debug.log('draggable', 'MANUAL_START', event);
						
						interaction.start({
							name: 'drag'
						}, event.interactable, $clone[0]);
					}
				};
				
				var interactObj = interact($e[0]).origin("body").draggable(draggableOptions).styleCursor(false);
				
				!$device.isTouch() && interactObj.on('move', manualStart);
				$device.isTouch() && interactObj.on('hold', manualStart);
			}
		};
	}]);
})();
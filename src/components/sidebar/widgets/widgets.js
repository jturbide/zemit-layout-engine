(function() {
	Zemit.app.directive('zmSidebarWidgets', ['$session', '$filter', function($session, $filter) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/widgets/widgets.html',
			link: function ($s, $e, attrs) {
				
				var widgets = Zemit.widgets.getAll();
				var session = $session.get();
				
				// List of available widgets (items)
				var sections = {
					structure: {
						title: 'Structure',
						widgets: []
					},
					content: {
						title: 'Content',
						widgets: []
					},
					custom: {
						title: 'Custom',
						widgets: []
					}
				};
				
				var filters = {
					query: ''
				};
				
				var tabsConfigs = {};
				angular.forEach(sections, function(section, key) {
					tabsConfigs[key] = {
						visible: true
					};
				});
				
				var updateWidgets = function() {
					
					var noWidgetsFound = true;
					angular.forEach(sections, function(section, key) {
						section.widgets = [];
					});
					angular.forEach(widgets, function(widget, key) {
						var inject = widget.injectable;
						if(inject && sections[inject.section] && $filter('search')([inject], ['title','desc'], filters.query, true).length > 0) {
							sections[widget.injectable.section].widgets.push({
								type: key,
								title: inject.title,
								desc: inject.desc,
								icon: inject.icon
							});
							
							noWidgetsFound = false;
						}
					});
					
					$s.noWidgetsFound = noWidgetsFound;
				};
				updateWidgets();
				
				$s.$watch('filters.query', function(nv, ov) {
					updateWidgets();
				});
				
				$session.prepare({
					sidebar: {
						widgets: {
							tabs: tabsConfigs
						}
					}
				});
				
				$s.sections = sections;
				$s.filters = filters;
			}
		};
	}]);
	
	/**
	 * Default widget
	 */
	Zemit.app.directive('zmSidebarWidgetsItem', ['$zm', '$compile', '$timeout', '$device', function($zm, $compile, $timeout, $device) {
		return {
			restrict: 'A',
			replace: true,
			link: function($s, $e, attrs) {
				
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
						container: $e.parents('zemit:eq(0)').find('.zm-container-scrollable:eq(0)')[0],
					},
					onmove: function(event) {
						
						if(!event.interaction.isReady) {
							return;
						}
						
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
						// $element[0].style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
					
						// Update the position attributes
						target.setAttribute('data-x', x);
						target.setAttribute('data-y', y);
						
						var element = document.elementFromPoint(
							event.clientX,
							event.clientY
						);
						
						//if(!event.interaction.mouse) {
							angular.element(element).trigger('dragHoverTouch', {
								x: event.clientX,
								y: event.clientY
							});
						//}
						
						event.stopPropagation();
					},
					onend: function(event) {
						
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
						
						// Unset dragged widget
						//$zm.widget.drag.set(null);
						
						if($device.isSmall()) {
							$s.$apply(function() {
								$s.sidebar.tabs.unhideAll();
								$s.sidebar.tabs.closeAll();
							});
						}
						
						event.interaction.$element.remove();
						$element.remove();
					}
				};
				
				var onStart = function(event) {
					
					event.interaction.dontRemove = true;
					event.interaction.dropState = {
						position: null,
						part: null,
						widget: null
					};
					
					var $clone = angular.element($e[0].cloneNode(true));
					$clone.addClass('zm-widget-draggable');
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
					
					event.interaction.draggedWidget = {
						type: attrs.zmSidebarWidgetsItem
					};
					
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
						if($device.isSmall()) {
							$s.sidebar.tabs.hideAll();
						}
						
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
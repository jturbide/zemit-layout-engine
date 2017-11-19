(function() {
	Zemit.app.directive('zmSidebarWidgets', ['$config', '$filter', function($config, $filter) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/widgets/widgets.html',
			link: function ($s, $e, attrs) {
				
				var widgets = Zemit.widgets.getAll();
				var config = $config.get();
				
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
				
				$config.prepare({
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
					restrict: {
						endOnly: true,
						restriction: "zemit",
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
						
						if(event.interaction.interacting()) {
					    	event.preventDefault();
					    }
					    
						var target = event.interaction.$element[0],
							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
							y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
						var $element = event.interaction.$element;
						
						// translate the element
						$element.css('top', y + 'px');
						$element.css('left', x + 'px');
					
						// update the posiion attributes
						target.setAttribute('data-x', x);
						target.setAttribute('data-y', y);
						
						if(!event.interaction.manual && !event.interaction.mouse) {
							
							var element = document.elementFromPoint(
								event.clientX,
								event.clientY
							);
							angular.element(element).trigger('dragHoverTouch', {
								x: event.clientX,
								y: event.clientY
							});
						}
						
						event.stopPropagation();
					},
					onend: function(event) {
						
						var target = event.interaction.$element[0];
						var $element = event.interaction.$element;
						
						// Reset widget position
						$element.css('top', '');
						$element.css('left', '');
						$element.css('width', '');
						$element.css('height', '');
						target.removeAttribute('data-x');
						target.removeAttribute('data-y');
						
						// Unset dragged widget
						$zm.widget.drag.set(null);
						
						if(window.innerWidth < 767) {
							$s.$apply(function() {
								$s.sidebar.tabs.unhideAll();
								$s.sidebar.tabs.closeAll();
							});
						}
						
						event.interaction.dontRemove = false;
						event.interaction.$element.remove();
					}
				};
				
				var onStart = function(event) {
					
					event.interaction.dontRemove = true;
					
					var $clone = angular.element($e[0].cloneNode(true));
					$clone.addClass('zm-widget-draggable');
					document.body.appendChild($clone[0]);
					event.interaction.$element = $clone;
					
					// Create temporary widget
					var $widget = angular.element('<zm-widget></zm-widget>');
					$widget.attr('type', attrs.zmSidebarWidgetsItem);
					var $compiledWidget = $compile($widget)($s, function($cloned, scope) {
						
						// Set dragged widget
						$timeout(function() {
							
							scope.$element = $clone;
							$clone.css('top', $e.offset().top + 'px');
							$clone.css('left', $e.offset().left + 'px');
							$clone[0].setAttribute('data-x', $e.offset().left);
							$clone[0].setAttribute('data-y', $e.offset().top);
							$clone.css('width', $e.width());
							$clone.css('height', $e.height());
							
							// If in portrait mode, close all sidebar tabs
							if(window.innerWidth < 767) {
								$s.sidebar.tabs.hideAll();
							}
							
							scope.widget.updateToken();
							$zm.widget.drag.set(scope.widget, true);
						});
					});
					
					return $clone;
				}
				
				if(!$device.isTouch()) {
					draggableOptions.onstart = onStart;
				}
				else {
					draggableOptions.manualStart = true;
				}
				
				/**
				 * Move the element around
				 */
				var interactObj = interact($e[0]).origin("body").draggable(draggableOptions).styleCursor(false);
				
				if($device.isTouch()) {
					interactObj.on('hold', function(event) {
						
						var interaction = event.interaction;
						interaction.dontRemove = true;
						
						if (!interaction.interacting()) {
							
							$device.vibrate();
							var $clone = onStart(event);
							
							interaction.start({
								name: 'drag'
							}, event.interactable, $clone[0]);
						}
					});
				}
			}
		};
	}]);
})();
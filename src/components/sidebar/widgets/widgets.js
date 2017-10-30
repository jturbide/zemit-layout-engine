(function() {
	Zemit.app.directive('zmSidebarWidgets', ['$config', function($config) {
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
				
				var tabsConfigs = {};
				angular.forEach(sections, function(section, key) {
					tabsConfigs[key] = {
						visible: false
					};
				});
				
				$config.prepare({
					sidebar: {
						widgets: {
							tabs: tabsConfigs
						}
					}
				});
				
				angular.forEach(widgets, function(widget, key) {
					var inject = widget.injectable;
					if(inject && sections[inject.section]) {
						sections[widget.injectable.section].widgets.push({
							type: key,
							title: inject.title,
							desc: inject.desc,
							icon: inject.icon
						});
					}
				});
				
				$s.sections = sections;
				$s.config = config.sidebar.widgets;
			}
		};
	}]);
	
	/**
	 * Default widget
	 */
	Zemit.app.directive('zmSidebarWidgetsItem', ['$zm', '$config', '$compile', '$timeout', '$device', function($zm, $config, $compile, $timeout, $device) {
		return {
			restrict: 'A',
			replace: true,
			link: function($s, $e, attrs) {
				
				/**
				 * Move the element around
				 */
				interact($e[0]).draggable({
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
					autoScroll: true,
					onstart: function(event) {
						
						if(!event.interaction.manual && !event.interaction.mouse) {
							event.interaction.stop();
							return false;
						}
						
						event.interaction.manual = false;
						
						// Create temporary widget
						var $widget = angular.element('<zm-widget></zm-widget>');
						$widget.attr('type', attrs.zmSidebarWidgetsItem);
						var $compiledWidget = $compile($widget)($s, function($cloned, scope) {
							
							// Set dragged widget
							$timeout(function() {
								var $element = angular.element(event.target);
								event.interaction.$element = $element;
								scope.$element = $element;
								
								$element.css('top', $e.offset().top + 'px');
								$element.css('left', $e.offset().left + 'px');
								$element[0].setAttribute('data-x', $e.offset().left);
								$element[0].setAttribute('data-y', $e.offset().top);
								$element.css('width', $e.width());
								$element.css('height', $e.height());
								
								// If in portrait mode, close all sidebar tabs
								if(window.innerWidth < 767) {
									$s.sidebar.tabs.hideAll();
								}
								
								$zm.widget.drag.set(scope.widget, true);
							});
							
						});
					},
					onmove: function(event) {
						
						if(event.interaction.interacting()) {
					    	event.preventDefault();
					    }
					    
						var target = event.target,
							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
							y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
						var $element = angular.element(event.target);
						
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
						
						var target = event.target;
						var $element = angular.element(event.target);
						
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
				}).on('hold', function(event) {
					
					var interaction = event.interaction;
					interaction.manual = true;
					interaction.dontRemove = true;
					
					if (!interaction.interacting()) {
						
						$device.vibrate();
						
						var $clone = angular.element(event.currentTarget.cloneNode(true));
						$clone.addClass('zm-widget-draggable');
						//$clone.appendTo($e.parents('.zm-widget-container').eq(0));
						document.body.appendChild($clone[0]);
						
						interaction.start({
							name: 'drag'
						}, event.interactable, $clone[0]);
					}
				}).styleCursor(false);
			}
		};
	}]);
})();
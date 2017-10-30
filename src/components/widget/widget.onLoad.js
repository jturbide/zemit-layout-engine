/**
 * Main widget directive (all widgets inherits from this one)
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.directive('zmWidget', ['$compile', '$history', '$zm', '$device', function($compile, $history, $zm, $device) {
		return {
			restrict: 'E',
			replace: true,
			priority: 2,
			link: function($s, $e, attrs) {
				
				var namespace = 'zmWidget';
				var $element;
				
				$s.isDraggable = false;
				
				angular.extend($s.widget, {
					
					/**
					 * Unbind all events from widget
					 */
					unbindEvents: function(events) {
						
						if(!events) {
							$element.off('.' + namespace);
							interact($element[0]).draggable(false);
							$s.isDraggable = false;
						}
						else {
							events.forEach(function(name) {
								switch(name) {
									case 'draggable':
										$s.isDraggable = false;
										interact($element[0]).draggable(false);
										break;
									case 'drop':
										interact($element[0]).drop(false);
										break;
									default:
										$element.off(name + '.' + namespace);
										break;
								}
							});
						}
					},
					
					/**
					 * Bind all events on widget
					 */
					bindEvents: function() {
						
						var _this = this;
						var configs = this.getScope().configs;
						
						$element.on('dragHoverTouch', function(event, pos) {
							
							event.stopPropagation();
							event.clientX = pos.x;
							event.clientY = pos.y;
							
							$zm.widget.hovered.data.forEach(function(widget) {
								widget.getScope().isDropHover = false;
								widget.getScope().$digest();
							});
							
							$zm.widget.hovered.set(_this, true);
							$zm.widget.hovered.data[0].getScope().isDropHover = true;
							$zm.widget.hovered.data[0].getScope().$digest();
							
							$zm.widget.hovered.data.forEach(function(widget) {
								widget.getScope().position.set(event);
							});
							
							$s.$digest();
						});
						
						if(configs.selectable !== false) {
							
							$element.on('click.' + namespace, function(event) {
								
								var selectAll = event.shiftKey;
								var incremental = event.ctrlKey || event.metaKey;
								
								_this.select(selectAll, incremental);
								event.stopPropagation();
								$s.$apply();
							});
							$element.on('touchstart.' + namespace, function(event) {
								
								_this.select();
								event.stopPropagation();
								$s.$apply();
							});
							$element.on('touchmove.' + namespace, function(event) {
								
								var element = document.elementFromPoint(
									event.touches[0].clientX,
									event.touches[0].clientY
								);
								angular.element(element).trigger('dragHoverTouch', {
									x: event.touches[0].clientX,
									y: event.touches[0].clientY
								});
							});
							$element.on('mouseout.' + namespace, function() {
								$zm.widget.hovered.unset(_this);
								_this.removeHighlight();
								$s.$digest();
							});
							$element.on('mouseover.' + namespace, function(event) {
								$zm.widget.hovered.set(_this);
								_this.highlight(event);
								$s.$digest();
							});
							$element.on('mousemove.' + namespace, function(event) {
								$s.position.set(event);
								$s.$digest();
							});
						}
						
						$s.$watch('isDraggable', function(nv, ov) {
							if(nv !== ov) {
								$element.toggleClass('zm-draggable', nv);
							}
						});
						$s.$watch('isSelected', function(nv, ov) {
							if(nv !== ov) {
								$element.toggleClass('zm-selected', nv);
							}
						});
						$s.$watch('isHighlighted', function(nv, ov) {
							if(nv !== ov) {
								$element.toggleClass('zm-highlighted', nv);
							}
						});
							
						(function() {
							var dropMemory = {
								$zone: $element,
							};
							var initialDropValues = {
								last: {
									widget: null,
									position: null,
									part: null,
									hoveredWidget: null
								}
							};
							angular.extend(dropMemory, angular.copy(initialDropValues));
							
							if(dropMemory.$zone.length === 0) {
								return;
							}
							
							if($s.configs.draggable !== false) {
								
								$s.isDraggable = true;
								
								/**
								 * Move the element around
								 */
								var $draggable = $element.find('.zm-widget-inner:eq(0)');
								interact($draggable[0]).draggable({
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
										
										// Set dragged widget
										$zm.widget.drag.set(_this);
									},
									onmove: function(event) {
										
										var target = event.target,
											// keep the dragged position in the data-x/data-y attributes
											x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
											y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
									
										// translate the element
										$draggable.css('top', y + 'px');
										$draggable.css('left', x + 'px');
									
										// update the posiion attributes
										target.setAttribute('data-x', x);
										target.setAttribute('data-y', y);
										
										event.stopPropagation();
									},
									onend: function(event) {
										
										var target = event.target;
										
										// Reset widget position
										$draggable.css('top', '');
										$draggable.css('left', '');
										target.removeAttribute('data-x');
										target.removeAttribute('data-y');
										
										// Unset dragged widget
										$zm.widget.drag.set(null);
									}
								}).on('hold', function(event) {
									
									var interaction = event.interaction;
									interaction.manual = true;
									
									if(!interaction.interacting()) {
										
										$device.vibrate();
										
										interaction.start({name: 'drag'},
											event.interactable,
											event.currentTarget
										);
									}
								}).styleCursor(false);
							}
							
							/**
							 * Accept widgets to be dropped inside
							 */
							if($s.configs.drop
							&& ($s.configs.drop.outside.enabled || $s.configs.drop.inside.enabled)) {
								
								// Retrieve the container and its placeholder
								var $container = $s.container.getScope().$element;
								dropMemory.$placeholder = $s.container.getScope().$placeholder;
								
								/**
								 * Accept widgets to be dropped outside
								 */
								interact(dropMemory.$zone[0]).dropzone({
									accept: '.zm-widget-draggable',
									ondropmove: function(event) {
										
										var cursor = event.dragEvent.ctrlKey || event.dragEvent.metaKey ? 'copy' : 'move';
										
										// Set default drop effect to nothing
										$zm.widget.drag.resetCursor();
										
										// When releasing the button to drop the widget,
										// InteractJS run through ondropmove event once again
										// but we don't need to. Also, it corrupts the position
										// of the event.clientY and event.clientX which results
										// in a invalid calculation of the widget.position.set()
										// if(event.dragmove.buttons === 0) {
										// 	return true;
										// }
										
										var hoveredWidgets = $zm.widget.hovered.getAll();
										var draggedWidget = $zm.widget.drag.get();
										var draggedElement = draggedWidget.getScope().$element;
										if(hoveredWidgets.length === 0 || !draggedWidget) {
											return;
										}
										
										// Loop through all widgets found and
										// if once match any of the conditions,
										// break the loop and end the process.
										for(var hwk = 0; hwk < hoveredWidgets.length; hwk++) {
											
											var hoveredWidget = hoveredWidgets[hwk];
											var hoveredScope = hoveredWidget.getScope();
											var configs = hoveredScope.configs;
											var pos = hoveredScope.position;
											
											// If hovered widget is the same as the dragged
											// one, skip this process
											if(draggedWidget.token === hoveredWidget.token
											|| !configs.drop) {
												return;
											}
											
											var isSame = false;
											var isInside = configs.drop.inside.enabled
												//&& (!configs.drop.inside.ifEmpty || hoveredWidget.childs.length === 0)
												&& (configs.drop.inside.accept.indexOf(draggedWidget.type) !== -1 || configs.drop.inside.accept.indexOf('*') !== -1)
												&& (!configs.drop.inside.decline || configs.drop.inside.decline.indexOf(draggedWidget.type) === -1)
												&& hoveredScope.isDropHover;
											
											/**
											 * When dragging inside a widget, there might be other
											 * widgets inside. If those widgets (childs) accept outside widgets,
											 * we try to calculate the current position of the hovered widget (parent)
											 * and position the placeholder at the right spot next to the child.
											 */
											(function() {
												if(hoveredScope.isDropHover && hoveredWidget.childs.length) {
													
													var firstChild = hoveredWidget.childs[0];
													var firstChildScope = firstChild.getScope();
													var firstChildConfigs = firstChildScope.configs;
													var align = firstChildConfigs.drop.outside.align;
													var directions;
													switch(align) {
														case 'vertical':
															directions = ['left', 'pageX', 'outerWidth', 'x'];
															break;
														case 'horizontal':
															directions = ['top', 'pageY', 'outerHeight', 'y'];
															break;
													}
													
													// Check position of childs and try to select the
													// nearest one
													var isFound = false;
													for(var i = 0; i < hoveredWidget.childs.length; i++) {
														
														var child = hoveredWidget.childs[i];
														
														// Drag even position greater than widget position
														if(child.getScope().$element.offset()[directions[0]] <= event.dragmove[directions[1]]
														// Drag event position smaller than widget position + size
														&& (child.getScope().$element.offset()[directions[0]] + eval('child.getScope().$element.' + directions[2] + '()')) >= event.dragmove[directions[1]]) {
															
															// Not the dragged widget
															if(child.token !== draggedWidget.token) {
																hoveredWidget = child;
																hoveredScope = child.getScope();
																
																// Update position of the cursor hover the child widget
																hoveredScope.position.set(event.interaction.prevEvent, hoveredScope.$element[0]);
															}
															// Is the current dragged widget
															else {
																isSame = true;
																return;
															}
															
															isFound = true;
															break;
														}
													}
													
													// If no child widget match the parent position, try to place
													// the placeholder at the first or last position depending of its
													// current position in the current hovered widget.
													if(!isFound) {
														
														var firstChild = hoveredWidget.childs[0];
														var lastChild = hoveredWidget.childs[hoveredWidget.childs.length - 1];
														hoveredWidget = event.dragmove[directions[1]] <= firstChild.getScope().$element.offset()[directions[0]]
															? firstChild
															: event.dragmove[directions[1]] >= (lastChild.getScope().$element.offset()[directions[0]] + eval('lastChild.getScope().$element.' + directions[2] + '()'))
																? lastChild
																: hoveredWidget;
														
														// Hightlight current dragged element if it's the same
														if(hoveredWidget.token === draggedWidget.token) {
															isSame = true;
															return;
														}
														else {
															
															// Update position of the cursor hover the child widget
															hoveredScope = hoveredWidget.getScope();
															hoveredScope.position.set(event.dragmove, hoveredScope.$element[0]);
														}
													}
													
													// Update hovered widget, scope and configs for further usage below
													pos = hoveredScope.position;
													hoveredScope = hoveredWidget.getScope();
													configs = hoveredScope.configs;
													
													isInside = false;
												}
											})();
											
											if(isSame) {
												
												if(dropMemory.$placeholder) {
													dropMemory.$placeholder.hide();
												}
												
												dropMemory.last.widget = null;
												draggedElement.addClass('zm-drop-inside-activate');
												
												return;
											}
											
											if(draggedElement.hasClass('zm-drop-inside-activate')) {
												draggedElement.removeClass('zm-drop-inside-activate');
											}
											
											// Inside dropping
											if(isInside) {
												
												var align = configs.drop.inside.align;
												
												if(dropMemory.$placeholder) {
													dropMemory.$placeholder.hide();
												}
												
												dropMemory.last.widget = hoveredWidget;
												dropMemory.last.position = null;
												dropMemory.last.part = 'inside';
												dropMemory.last.hoveredWidget = hoveredWidget;
												
												// If a hook on the "can drop" verification has been
												// declared, try to run it.
												hoveredWidget.setDropInsideActivate(true,
													(configs.drop.canDrop instanceof Function
														? configs.drop.canDrop(draggedWidget, hoveredWidget)
														: true)
												);
												
												// Set default drop effect to copy if CTRL or Command key enabled
												$zm.widget.drag.setCursor(cursor);
												
												return;
											}
											// Outside dropping
											else if(configs.drop.outside.enabled
											&& (configs.drop.outside.accept.indexOf(draggedWidget.type) !== -1 || configs.drop.outside.accept.indexOf('*') !== -1)
											&& (!configs.drop.outside.decline || configs.drop.outside.decline.indexOf(draggedWidget.type) === -1)) {
												
												var align = configs.drop.outside.align;
												
												var position;
												switch(align) {
													case 'vertical':
														position = pos.x >= 50 ? 'after' : 'before';
														break;
													case 'horizontal':
														position = pos.y >= 50 ? 'after' : 'before';
														break;
												}
		
												if((!dropMemory.last.widget || (hoveredWidget.token !== dropMemory.last.widget.token))
												|| (!dropMemory.last.position || (position !== dropMemory.last.position))) {
													
													if(dropMemory.last.hoveredWidget) {
														dropMemory.last.hoveredWidget.setDropInsideActivate(false);
													}
														
													var $body = angular.element('body');
													var $hovEle = hoveredScope.$element;
													var hovStyle = dropMemory.$placeholder[0].style;
													var placeClassList = dropMemory.$placeholder[0].classList;
													placeClassList.remove('zm-drop-placeholder-vertical', 'zm-drop-placeholder-horizontal');
													switch(align) {
														case 'vertical':
															hovStyle.width = '3px';
															hovStyle.height = $hovEle.height() + 'px';
															placeClassList.add('zm-drop-placeholder-vertical');
															break;
														case 'horizontal':
															hovStyle.width = $hovEle.outerWidth() + 'px';
															hovStyle.height = '3px';
															placeClassList.add('zm-drop-placeholder-horizontal');
															break;
													}
													
													var top = $hovEle.offset().top + (position === 'after' && align === 'horizontal' ? $hovEle.outerHeight() : 0);
													var left = $hovEle.offset().left + (position === 'after' && align === 'vertical' ? $hovEle.outerWidth() : 0)
													
													top -= ($container.offset().top - $body.offset().top);
													left -= ($container.offset().left - $body.offset().left);
													
													hovStyle.top = top + 'px';
													hovStyle.left = left + 'px';
													
													dropMemory.last.widget = hoveredWidget;
													dropMemory.last.position = position;
													dropMemory.last.part = 'outside';
													
													placeClassList.remove('zm-drop-placeholder-before', 'zm-drop-placeholder-after');
													placeClassList.add('zm-drop-placeholder-' + position);
													dropMemory.last.hoveredWidget = hoveredWidget;
													dropMemory.$placeholder.show();
												}
												
												// Set default drop effect to copy if CTRL or Command key enabled
												$zm.widget.drag.setCursor(cursor);
												
												return;
											}
										}
									},
									ondragleave: function(event) {
										
										if(dropMemory.last.widget) {
											
											var drag = $zm.widget.drag.get();
											var draggedElement = drag.getScope().$element;
											if(draggedElement.hasClass('zm-drop-inside-activate')) {
												draggedElement.removeClass('zm-drop-inside-activate');
											}
											
											// Remove original element and
											// placeholder from document
											dropMemory.last.hoveredWidget.setDropInsideActivate(false);
											dropMemory.$placeholder.hide();
											dropMemory.last.widget = null;
										}
									},
									ondrop: function(event) {
									
										// Finalize callback
										var finalize = function(newWidget) {
											
											// Hide placeholder
											dropMemory.$placeholder.hide();
											
											var drag = $zm.widget.drag.get();
											var draggedElement = drag.getScope().$element;
											if(draggedElement.hasClass('zm-drop-inside-activate')) {
												draggedElement.removeClass('zm-drop-inside-activate');
											}
											
											if(newWidget) {
												
												switch(dropMemory.last.part) {
													case 'inside':
														// Insert dragged element at given position
														scope.widget.addNewChild(newWidget);
														
														// Unset hovered widget
														dropMemory.last.hoveredWidget.setDropInsideActivate(false);
														break;
														
													case 'outside':
														// Insert dragged element at given position
														parent.addNewChild(newWidget, dropMemory.last.position === 'before'
																? index
																: index + 1);
														break;
												}
												
												// Digest scope so new indexes
												// are generated
												$s.$apply();
												
												// Unset the dragged widget
												// before removing it from the
												// document.
												$zm.widget.drag.set(null);
												
												// If CTRL or Command key are enabled, do not erase dragged element
												// (duplicate)
												if(!event.dragEvent.ctrlKey && !event.dragEvent.metaKey && !event.interaction.dontRemove) {
													drag.remove();
												}
											}
											
											// Reset all values
											angular.extend(dropMemory, angular.copy(initialDropValues));
											
											// Digest scope
											$s.$apply();
										};
										
										// If no widget hovered, skip this
										// process and reset
										if(!dropMemory.last.widget) {
											return finalize(false);
										}
										
										// Clone dragged element
										var dragged = $zm.widget.drag.get();
										var clone = dragged.clone(event.dragEvent.ctrlKey || event.dragEvent.metaKey);
										var parent = dropMemory.last.widget.getParent();
										var scope = dropMemory.last.widget.getScope();
										var configs = scope.configs;
										var index = scope.$index;
										
										// If a hook on the drop callback has been
										// declared, try to run it.
										$zm.action(function() {
											(configs.drop.onDrop instanceof Function)
												? configs.drop.onDrop(clone, parent, index, dropMemory.last.part, finalize)
												: finalize(clone);
										});
									}
								}).styleCursor(false);
							}
						})();
					},
				
					/**
					 * Bind events on widget load
					 */
					onLoad: function(_$element) {
						
						$element = _$element;
						this.bindEvents();
						
						$s.hooks.run('onLoad', $element);
						
						setTimeout(function() {
							$e.addClass('visible');
						});
					}
				});
			}
		};
	}]);
})();
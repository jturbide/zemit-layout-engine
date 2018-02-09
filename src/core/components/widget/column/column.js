/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Column widget
	 * 
	 * A column widget that you can resize and in which you can insert
	 * other widgets.
	 */
	Zemit.app.onReady(['$i18n', function($i18n) {
		Zemit.widgets.init('column', {
			injectable: {
				section: 'structure',
				title: $i18n.get('core.components.widget.column.title'),
				desc: $i18n.get('core.components.widget.column.desc'),
				icon: 'columns',
			},
			drop: {
				outside: {
					accept: ['column'],
					decline: false
				},
				inside: {
					accept: '*',
					decline: 'column'
				}
			},
			defaultTemplate: false,
			autoSetup: false,
			tooltip: (widget) => {
				return 'Column ' + widget.size + '/12';
			},
			controller: function($s, $e, $di, attrs) {
		
				var colMaxSize = 12;
				var $history = $di.get('$history');
				var $device = $di.get('$device');
				
				$e.parent().after($e);
				
				// Set column scope to widget
				$s.column = $s.widget;
				
				/**
				 * Set default widget values
				 */
				var configure = function(column) {
					
					column.getScope().hooks.add('onBeforeDuplicate', function(newColumn) {
						
						var index = column.getIndex();
						var parent = column.getParent();
						var previous = parent.childs[index - 1];
						var next = parent.childs[index + 1];
						
						if(newColumn.size === 1) {
							
						}
						else {
							newColumn.size = Math.ceil(newColumn.size / 2);
							column.size = Math.floor(column.size / 2);
						}
					});
					
					/**
					 * Whenever a column is removed, reapply to size to
					 * the nearest column starting from the right. If no
					 * more column, delete the row.
					 */
					column.getScope().hooks.add('onBeforeRemove', function() {
						
						var index = column.getIndex();
						var parent = column.getParent();
						var previous = parent.childs[index - 1];
						var next = parent.childs[index + 1];
						
						// Make sure the column removal doesn't come from
						// an insert/remove automatism which could result in
						// more sizing than normal.
						var total = 0;
						parent.childs.forEach(function(col) {
							total += col.size;
						});
						if((total - column.size) === colMaxSize) {
							return;
						}
					   
						// If the column is preceded or followed by another
						// column, redistribute its size to these other columns
						// considering that the previous column will always
						// receive the ceiled amount of the division.
						if(previous) {
							previous.size += next
								? Math.ceil(column.size / 2)
								: column.size;
						}
						if(next) {
							next.size += previous
								? Math.floor(column.size / 2)
								: column.size;
						}
						
						// If no other columns found, remove the row
						if(!next && !previous) {
							parent.remove();
						}
					});
					
					column.setup({
						drop: {
							outside: {
								align: 'vertical',
								accept: ['column'],
								decline: false
							},
							inside: {
								enabled: true,
								decline: ['column'],
								// conditions: {
								// 	ifEmpty: true
								// }
							},
							canDrop: function(draggedWidget, hoveredWidget) {
								
								var parent = hoveredWidget.getParent();
								if(parent.childs.length < colMaxSize) {
									return true;
								}
								
								return false;
							},
							onBeforeDrop: function(widget, parent, index, part, callback = () => {}) {
								
								var otherWidget = parent.childs[index];
								
								// If dropped inside or in the same row, skip this process
								if(part === 'inside'
								|| (widget.getScope && widget.getScope().parentToken === otherWidget.getScope().parentToken)) {
									return callback && callback(widget);
								}
								
								if(!widget.size) {
									widget.size = 12;
								}
								
								// Calculate the new sizes
								var newSize = widget.size;
								
								// We'll try two different approaches. First,
								// we check if it's possible to redistribute the
								// sizes between the current and the other
								// widget evenly. Second, we check if we can
								// redistribute the sizes evenly between
								// all widgets of the row.
								if(widget.size >= 2 && otherWidget.size >= 2) {
									
									var diff = otherWidget.size / 2;
									
									// Apply other widget size
									newSize = Math.ceil(diff);
									otherWidget.size = Math.floor(diff);
								}
								else if(parent.childs.length < colMaxSize) {
									
									var candidateSize = Math.round(colMaxSize / parent.childs.length);
									var candidateSizeLoop = candidateSize;
									for(var i = 0; i < candidateSizeLoop; i++) {
										
										var idx = i % parent.childs.length;
										if(parent.childs[idx].size < 2) {
											candidateSizeLoop++;
											continue;
										}
										
										parent.childs[idx].size--;
									}
									
									newSize = candidateSize;
								}
								
								// Apply current widget size
								widget.size = Math.ceil(newSize);
								
								// Return the new widget
								return callback(widget);
							}
						},
						defaultValues: {
							size: column.size || colMaxSize
						}
					});
				};
				
				// Configure current column
				configure($s.column);
				
				/**
				 * Resizer sub-class. Contains all necessary functions to
				 * resize columns.
				 */
				$s.resize = {
					originalSize: null,
					isResizing: false,
					handlerActive: false,
					transaction: null,
					init: function() {
						
						var $resizeHandler = $e.find('.zm-widget-column-resize-handler');
						var breakpoint;
						var resizer = interact($e[0]).resizable({
							preserveAspectRatio: false,
							edges: {
								left: false,
								right: $resizeHandler[0],
								bottom: false,
								top: false
							}
						}).on('resizestart', function(event) {
							
							$s.widget.removeHighlight($s.widget);
							
							$s.resize.originalSize = $s.column.size;
							$s.resize.transaction = $history.transaction($s.row.childs);
							$s.resize.handlerActive = true;
							
							$s.row.forEachChilds(function(widget) {
								widget.getScope().resize.isResizing = true;
							}, false);
							
							breakpoint = event.rect.width / $s.column.size;
							
							angular.element('html:eq(0)').addClass('zm-cursor-resize-col-resize-all');
							
						}).on('resizemove', function(event) {
							
							var size = Math.round(event.rect.width / breakpoint);
							if(size < 1) {
								size = 1;
							}
							
							if(size !== $s.column.size) {
								$s.$apply(function() {
									$s.resize.resize(size);
								});
							}
							
						}).on('resizeend', function(event) {
							
							$s.resize.handlerActive = false;
							$s.row.forEachChilds(function(widget) {
								widget.getScope().resize.isResizing = false;
							}, false);
							
							if($s.resize.originalSize !== $s.column.size) {
								$s.resize.transaction();
							}
							$s.resize.transaction = null;
							
							angular.element('html:eq(0)').removeClass('zm-cursor-resize-col-resize-all');
							
						}).styleCursor(false);
					},
					resize: function(size) {
						
						var nextColumn;
						var nextSize = size;
						var diff = size - $s.column.size;
						
						if($s.row.childs.length !== $s.$index + 1) {
							nextColumn = $s.row.childs[$s.$index + 1];
							nextSize = nextColumn.size - diff;
						}
						
						if(nextColumn && nextSize > 0) {
							nextColumn.size = nextSize;
							$s.column.size = size;
						}
					}
				};
			
				// Initialize the resizer
				$s.resize.init();
				
				/**
				 * Divider sub-class. Contains all necessary functions to
				 * divide a column in two.
				 */
				// $s.divide = {
				// 	isHover: false,
				// 	action: function(event) {
				// 		$zm.action(this.exec, [event], $s.widget);
				// 	},
				// 	exec: function(event) {
						
				// 		event.stopPropagation();
						
				// 		if($s.column.size === 1) {
				// 			throw new Exception('Column too small and can\'t be divided.');
				// 		}
						
				// 		// Calculate the new sizes
				// 		var newSize = $s.column.size / 2;
				// 		var otherSize = $s.column.size - newSize;
				// 		newSize = Math.ceil(newSize);
				// 		otherSize = Math.floor(otherSize);
						
				// 		// Get current widget index
				// 		$s.column.size = newSize;
						
				// 		// Add new column
				// 		var newColumn = $s.row.addNewChild('column', $s.$index + 1, {
				// 			size: otherSize
				// 		});
						
				// 		this.isHover = false;
						
				// 		console.log('COLUMN DIVIDE', $s.row.childs, $s.column, newColumn);
				// 	}
				// };
			}
		});
	}]);
})();
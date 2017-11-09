/**
 * Zemit Service
 * @author: <contact@dannycoulombe.com>
 * 
 * Store object in the cache
 */
(function() {
	Zemit.app.factory('$zm', ['$history', '$file', '$config', '$modal', function($history, $file, $config, $modal) {
	    
		var factory = {
		    
		    baseScope: null,
			version: Zemit.version,
			childs: [],
			
			defaultContainer: {
				version: Zemit.version,
				childs: []
			},
			
			defaultWidget: {
				styles: []
			},
			
			setBaseScope: function(scope) {
			    this.baseScope = scope;
			},
			
			getBaseScope: function() {
				return this.baseScope;
			},
			
			/**
			 * Find scope by it's scope ID (scope.$id)
			 */
			// getScopeById: function(id) {
				
			// 	var found;
			// 	this.baseScope.widget.forEachChilds(function(child) {
			// 		if(child.getScope().$id === id) {
			// 			found = child;
			// 		}
			// 	});
				
			// 	return found;
			// },
			
			/**
			 * GUID generator
			 */
			s4: function() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			},
			
			/**
			 * Convert string to camel cases
			 */
			camelize: function(str, firstUpper) {
				var strCamel = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
					return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
				}).replace(/\s+/g, '');
				
				return firstUpper === true
					? (strCamel.charAt(0).toUpperCase() + strCamel.slice(1))
					: strCamel;
			},
			
			/**
			 * Convert camelized strings to dashed
			 */
			camelToDash: function(str) {
				return str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
			},
			
			session: {
				
				flushHistory: function() {
					
					$history.flush();
				},
				
				flushAll: function() {
					
					$history.flush();
					$config.flush();
					factory.getBaseScope().widget.childs = [];
				}
			},
			
			content: {
				
				data: {},
				
				ENCODE: 1,
				DECODE: -1,
				
				parse: function(data, parser) {
					
					angular.forEach(data, function(d, k) {
						if(typeof d === 'string') {
							data[k] = parser === factory.content.ENCODE
								? encodeURIComponent(d)
								: decodeURIComponent(d);
						}
						else if(d instanceof Object
						|| d instanceof Array) {
							data[k] = factory.content.parse(d);
						}
					})
					return data;
				},
				
				/**
				 * Get Zemit data
				 */
				get: function(parser) {
					
					return (parser && this.parse(this.data)) || this.data;
				},
				
				/**
				 * Set Zemit data
				 */
				set: function(data, parser) {
					
					this.data = (parser && this.parse(data)) || data;
				},
				
				/**
				 * Export Zemit session to JSON and download it automatically
				 */
				export: function(filename = 'zemit') {
					
					var changes = $history.dump();
					var content = factory.content.get();
					var data = angular.toJson({
						changes: changes,
						content: content,
						version: Zemit.version
					});
					
					$file.downloadAs('text/json', filename + '.json', data);
				},
				
				/**
				 * Import Zemit session from computer (prompt a file dialog)
				 */
				import: function() {
					
					$file.promptFileDialog(function(file) {
						
						try {
							
							var reader = new FileReader();
							reader.onload = function(event) {
								var json = event.target.result;
								var data = angular.fromJson(json);
								
								if(data.version !== Zemit.version) {
									
									$modal.warning({
										title: 'Version mismatch',
										content: 'The version you are using (' + Zemit.version + ') does not match the imported one (' + data.version + ')'
									});
								}
								else {
									factory.session.flushAll();
									$history.load(data.changes);
									factory.getBaseScope().widget.childs = data.content.childs;
								}
							}
							reader.readAsText(file);
						}
						catch(e) {
							
							$modal.error({
								title: 'Wrong file format',
								content: 'The file you are trying to import doesn\'t seem to be in a valid Zemit file format.'
							});
						}
					});
				}
			},
			
			/**
			 * Find a widget by its token
			 */
			findByToken: function(token, container) {
				
				var found = false;
				container = container === undefined
					? this.baseScope.widget
					: container;
					
				// Check if it's the container first
				if(container.token === token) {
					return container;
				}
				
				// Loop through all childs and try to find a match
				container.forEachChilds(function(widget) {
					if(found) {
						return false;
					}
					
					if(widget.token === token) {
						found = widget;
					}
				});
				
				return found;
			},
			
			action: function(callback, params, widget) {
				
				widget = this.baseScope.widget;
				
				return $history.transaction(widget || this.baseScope.widget, function() {
					return callback.apply(null, params);
				});
			},
			
			widget: {
					
				totalSelected: 0,
				hoveredWidget: null,
				
				unselectAll: function() {
					
					factory.baseScope.widget.forEachChilds(function(_widget) {
						_widget.setSelected(false);
					});
				},
				
				hovered: {
					data: [],
					
					/**
					 * Get the latest hovered widget
					 */
					get: function() {
						
						var keys = Object.keys(this.data);
						return this.data[keys[0]];
					},
					
					/**
					 * Get the latest hovered widget
					 */
					getAll: function() {
						return this.data;
					},
					
					/**
					 * Check if widget already hovered
					 */
					isset: function(widget) {
						
						for(var i = 0; i < this.data.length; i++) {
							if(widget.token === this.data[i].token) {
								return true;
							}
						}
						
						return false;
					},
					
					/**
					 * Set the hovered widget in memory
					 */
					set: function(widget, clearAndTraverse = false) {
						
						if(!this.isset(widget) && !clearAndTraverse) {
							
							// If widget was in hovered list, it needs to be unset
							// when the widget is removed otherwise it ends-up
							// with a corrupted list
							widget.getScope().hooks.add('onBeforeRemove', function() {
								factory.widget.hovered.unset(widget);
							});
							
							this.data.push(widget);
						}
						else if(clearAndTraverse) {
							
							angular.forEach(this.data, function(widget) {
								factory.widget.hovered.unset(widget);
							});
							
							var data = [widget];
							widget.forEachParents(function(parent) {
								data.unshift(parent);
							});
							
							data.reverse();
							this.data = data;
						}
						
						// Output all hovered tokens to the console
						// var tokens = [];
						// angular.forEach(data, function(d) {
						// 	tokens.push(d.token);
						// });
						// console.log(tokens);
					},
					
					/**
					 * Unset given widget
					 */
					unset: function(widget) {
						
						for(var i = 0; i < this.data.length; i++) {
							if(widget.token === this.data[i].token) {
								this.data.splice(i, 1);
								return;
							}
						}
					}
				},
				
				drag: {
					enabled: false,
					data: null,
					originalWidget: null,
					
					/**
					 * Get the latest hovered widget
					 */
					get: function() {
						return this.data;
					},
					
					/**
					 * Set the hovered widget in memory
					 */
					set: function(widget, isAlone = false) {
						this.data = widget;
						this.enabled = widget !== null;
												
						if(this.enabled) {
							this.setCursor();
							
							widget.getScope().$element.addClass('zm-widget-drag');
							
							if(!isAlone) {
								widget.forEachParents(function(parent) {
									parent.getScope().$element.addClass('zm-widget-drag-parent');
								});
							}
							
							this.originalWidget = widget;
						}
						else if(this.originalWidget) {
							this.resetCursor();
							
							this.originalWidget.getScope().$element.removeClass('zm-widget-drag');
							
							if(!isAlone) {
								this.originalWidget.forEachParents(function(parent) {
									parent.getScope().$element.removeClass('zm-widget-drag-parent');
								});
							}
							
							this.originalWidget = null;
						}
					},
					
					setCursor: function(type) {
						
						type = type === undefined ? 'default' : type;
						
						this.resetCursor();
						angular.element('html:eq(0)').addClass('zm-cursor-drag-' + type);
					},
					
					resetCursor: function() {
						
						angular.element('html:eq(0)').removeClass('zm-cursor-drag-default zm-cursor-drag-move zm-cursor-drag-copy');
					}
				},
				
				/**
				 * Duplicate selected widgets
				 */
				duplicate: function() {
					
					factory.baseScope.widget.forEachChilds(function(widget, parent) {
						if(widget.getScope().isSelected) {
							var duplicate = widget.clone();
							var index = widget.getScope().$index;
							
							console.log('DUPLICATE', duplicate);
							
							widget.getParent().childs.splice(index + 1, 0, duplicate);
						}
					});
				},
				
				/**
				 * Remove selected widgets
				 */
				removeAllSelected: function() {
					
					factory.baseScope.widget.forEachChilds(function(widget, parent) {
						if(widget.getScope().isSelected) {
							widget.remove();
						}
					});
				}
			}
		};
		
		return factory;
	}]);
})();
/**
 * Main widget directive (all widgets inherits from this one)
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Widgets
	 */
	angular.extend(Zemit, {
		widgets: {
			data: {},
			toInit: [],
			register: function(uris) {
				
				if(typeof uris === 'string') {
					uris = [uris];
				}
				
				uris.forEach(function(uri) {
					var split = uri.split('/');
					var name = split[split.length - 1];
					
					Zemit.widgets.data[name] = angular.extend(
						angular.copy({
							dashedType: name, //TODO: remove when all widgets implements Zemit.widgets.init()
							defaultTemplate: true,
							uri: uri,
						})
					);
				})
				
			},
			extend: function(name, params) {
				this.data[name] = angular.extend(this.data[name], params);
			},
			init: function(name, params) {
				this.toInit.push({
					name: name,
					params: params
				});
			},
			get: function(name) {
				return this.data[name] || false;
			},
			getAll: function() {
				return this.data;
			}
		}
	});
	
	/**
	 * App initialization
	 */
	Zemit.app.run(['$zm', function($zm) {
		
		Zemit.widgets.toInit.forEach(function(widget) {
			
			var dashed = $zm.camelToDash(widget.name);
			Zemit.widgets.extend(widget.name, {
				dashedType: dashed
			});
			Zemit.widgets.extend(widget.name, widget.params);
			
			// Register widget directive if controller provided
			if(widget.params.controller) {
				Zemit.app.compileProvider.directive('zmWidget' + $zm.camelize(widget.name, true), ['$injector', function($injector) {
					return {
						restrict: 'E',
						replace: true,
						templateUrl: Zemit.widgets.get(widget.name).uri + '/' + dashed + '.admin.html',
						link: function($s, $e, attrs) {
							
							if(widget.params.defaultTemplate === false) {
								$s.$element = $e;
							}
							
							if(widget.params.autoSetup !== false) {
								$s.widget.setup(widget.params);
							}
							
							if(widget.params.controller instanceof Function) {
								widget.params.controller($s, $e, $injector, attrs);
							}
							
							$s.widget.onLoad($s.$element);
						}
					};
				}]);
			}
			
			// Register settings directive if controller provided
			if(widget.params.settings && widget.params.settings.controller) {
				Zemit.app.compileProvider.directive('zmSettings' + $zm.camelize(widget.name, true), ['$injector', '$zm', function($injector, $zm) {
					return {
						restrict: 'E',
						replace: true,
						scope: true,
						templateUrl: Zemit.widgets.get(widget.name).uri + '/' + dashed + '.admin.settings.html',
						link: function($s, $e, attrs) {
							
							var $widgets = {
								apply: function(data) {
									$zm.getBaseScope().widget.forEachSelected(function(widget) {
										if(widget.type === widget.name) {
											angular.extend(widget, data);
										}
									});
								},
								getData: function() {
									$zm.getBaseScope().widget.forEachSelected(function(widget) {
										if(widget.type === widget.name) {
											angular.extend(widget, data);
										}
									});
								},
								forEach: function(callback) {
									$zm.getBaseScope().widget.forEachSelected(function(widget) {
										if(widget.type === widget.name) {
											callback(widget);
										}
									});
								}
							};
							
							$s.widgets = $widgets;
							
							if(widget.params.settings.controller instanceof Function) {
								widget.params.settings.controller($s, $widgets, $injector, attrs);
							}
						}
					};
				}]);
			}
		});
	}]);
	
	Zemit.app.directive('zmWidget', ['$compile', '$hook', '$zm', '$modal', '$device', function($compile, $hook, $zm, $modal, $device) {
		return {
			restrict: 'E',
			replace: true,
			priority: 1,
			scope: true,
			link: function($s, $e, attrs) {
				
				// Widget type (mandatory)
				var type = attrs.type;
				
				// Prepare new hooks
				$s.hooks = new $hook.$new();
				
				// Prepare variables
				$s.configs = {};
				$s.isHighlighted = false;
				$s.isSelected = false;
				$s.isFocused = false;
				$s.isDropHover = false;
				$s.dropInsideIsActivated = false;
				$s.dropInsideIsInvalid = false;
				$s.$defaultElement = $e;
				
				/**
				 * Add widget panel manager
				 */
				$s.panel = {
					
					open: function(widget, index) {
						
						$modal.open('zm_widget_add', {
							openFrom: '#' + (widget || $s.widget).id,
							data: {
								widget: widget || $s.widget,
								index: index
							}
						});
					}
				};
				
				/**
				 * The position of the cursor over the widget
				 */
				$s.position = {
					
					x: 0,
					y: 0,
					bounds: null,
					
					/**
					 * Sets the position of the cursor based on the event
					 * provided.
					 */
					set: function(event, target) {
						
						var element = target || event.currentTarget || event.target;
						
						this.bounds = element.getBoundingClientRect();
						
						if(event.touches) {
							event = event.touches[0];
						}
						
						this.x = (event.clientX - this.bounds.left) * 100 / this.bounds.width;
						this.y = (event.clientY - this.bounds.top) * 100 / this.bounds.height;
					}
				};
				
				angular.extend($s.widget, {
					
					/**
					 * Set default values
					 */
					id: $s.widget.id || ('zm_' + type + '_' + $zm.s4()),
					token: $s.widget.token || (type + '_' + $zm.s4()),
					type: $s.widget.type || type,
					childs: $s.widget.childs || [],
					
					updateId: function() {
						this.id = ('zm_' + type + '_' + $zm.s4());
					},
					
					updateToken: function() {
						this.token = type + '_' + $zm.s4();
					},
					
					/**
					 * Highlight widget and remove highlighting of all parent and child widgets
					 */
					highlight: function($event) {
						
						var _this = this;
						
						if($event.buttons !== 0) {
							return;
						}
						$event.stopPropagation();
						
						this.getScope().isHighlighted = true;
						
						// Loop through all parents and remove their highlighting
						if(this.$parent) {
							this.$parent.removeHighlight();
						}
						this.forEachParentsChilds(function(widget) {
							if(widget.token !== _this.token) {
								widget.removeHighlight();
							}
						});
						
						var removeChildHighlighting = function(widget) {
							
							widget.forEachChilds(function(child) {
								if(child.token !== _this.token) {
									child.removeHighlight();
								}
								
								if(widget.childs) {
									removeChildHighlighting(child);
								}
							});
						};
						
						removeChildHighlighting(this);
					},
					
					/**
					 * Remove widget highlighting
					 */
					removeHighlight: function() {
					
						$s.isHighlighted = false;
					},
					
					/**
					 * Get parent widget
					 */
					getParent: function() {
					
						if(!this.hasParent() || !$s.$parent.$parent) {
							return false;
						}
						
						return $s.$parent.$parent.widget;
					},
					
					hasParent: function() {
						
						return $s.parentToken;
					},
					
					/**
					 * Select widget
					 * 
					 * IMPROVEMENTS: Could eventually be faster if the forEachChilds
					 * functions would be merged into one.
					 */
					select: function(selectAll, incremental, force) {
						
						var widget = this;
						var wasSelected = this.isSelected();
						
						if($device.isTouch()) {

							var newToken = false;							
							if(wasSelected) {
								newToken = this.getParent().token;
								this.getParent().setSelected(true);
							}
							else {

								widget.forEachParents(function(parent) {
									if(!newToken && parent.isSelected()) {
										var _parent = parent.getParent();
										if(_parent && _parent.getScope().parentToken) {
											newToken = _parent.token;
											_parent.setSelected(true);
										}
									}
								});
								
								if(!newToken) {
									newToken = widget.token;
									widget.setSelected(true);
								}
							}
							
							// Unselect all *other* widgets
							widget.getScope().container.forEachChilds(function(_widget) {
								
								if(_widget.token === newToken) {
									return;
								}
								
								_widget.setSelected(false);
							});
							
							return;
						}
						
						// If SHIFT, CTRL or COMMAND key are not active, unselect all widgets
						if(!selectAll && !incremental) {
							
							// Unselect all *other* widgets
							widget.getScope().container.forEachChilds(function(_widget) {
								
								if(_widget.token === widget.token) {
									return;
								}
								
								_widget.setSelected(false);
							});
						}
						
						// If SHIFT key is active, select all childs
						if(selectAll) {
							
							// Toggle target selection
							widget.setSelected(!wasSelected);
							
							// Select all childs
							widget.forEachChilds(function(_widget) {
								_widget.setSelected(!wasSelected);
							});
						}
						
						// Toggle target selection
						widget.setSelected(force === undefined ? !wasSelected : force);
					},
					
					/**
					 * Remove widget
					 */
					remove: function() {
						
						var $parent = this.getParent();
						if(!$parent) {
							return false;
						}
						else {
							
							var index = this.getIndex();
							$s.hooks.run('onBeforeRemove', this);
							$parent.childs.splice(index, 1);
							$s.hooks.run('onAfterRemove', this);
							
							$zm.widget.updateWidgetStates();
						}
					},
					
					/**
					 * Remove widget
					 */
					duplicate: function() {
						
						var $parent = this.getParent();
						if(!$parent) {
							return false;
						}
						else {
							
							var duplicate = this.clone();
							var index = this.getIndex();
							
							console.log('DUPLICATE', duplicate);
							
							$s.hooks.run('onBeforeDuplicate', duplicate);
							
							this.getParent().childs.splice(index + 1, 0, duplicate);
							
							$s.hooks.run('onAfterDuplicate', duplicate);
						}
						
						$zm.widget.updateWidgetStates();
					},
					
					getIndex: function() {
						
						var $parent = this.getParent();
						if($parent) {
							for(var i = 0; i < $parent.childs.length; i++) {
								if($parent.childs[i].token === this.token) {
									return i;
								}
							}
						}
						
						return 0;
					},
					
					getChild: function(token) {
						
						var found;
						this.forEachChilds(function(widget) {
							if(!found && widget.token === token) {
								found = widget;
							}
						});
						
						return found;
					},
					
					/**
					 * Setup widget
					 */
					setup: function(config) {
						
						config = angular.copy(config);
						
						$s.configs = {
							drop: {
								outside: {
									enabled: true,
									align: 'horizontal',
									accept: ['*'],
									decline: ['column']
								},
								inside: {
									enabled: false,
									accept: ['*'],
									decline: []
								}
							}
						};
						
						if(config) {
							
							// Add default values to widget
							if(config.defaultValues) {
								var widgetCopy = angular.copy(this);
								angular.extend($s.widget, config.defaultValues, widgetCopy);
							}
							
							// Add default configurations
							angular.merge($s.configs, config);
						}
					},
					
					/**
					 * Clone current widget
					 */
					clone: function(regenerate) {
						
						var clone = angular.copy(this);
						
						// Regenerate the widget token and ID
						if(regenerate || regenerate === undefined) {
							
							delete clone.id;
							
							clone.forEachChilds(function(child, parent) {
								delete child.id;
							});
						}
						
						this.updateToken();
						clone.forEachChilds(function(child, parent) {
							child.updateToken();
						});
						
						return clone;
					},
					
					/**
					 * Add a child inside widget
					 */
					addNewChild: function(type, index, defaultValues) {
						
						var widget;
						if(typeof type === 'string') {
							var defaultWidget = angular.copy($zm.defaultWidget);
							widget = angular.merge({}, defaultWidget, defaultValues);
							widget.type = type;
						}
						else {
							widget = type;
						}
						
						
						var childs = (this.childs || $s.widget.childs);
						if(index === undefined) {
							childs.push(widget);
						}
						else {
							childs.splice(index, 0, widget);
						}
						
						console.log('WIDGET ADD', widget);
						
						return widget;
					},
					
					/**
					 * Perform an action on each parents of the provided widget
					 */
					forEachParentsChilds: function(callback) {
						
						var _scope = $s.$parent;
						if(_scope) {
							while(_scope && _scope.widget && _scope.widget.childs) {
								angular.forEach(_scope.widget.childs, (child) => {
									if(child.getScope instanceof Function) {
										callback(child);
									}
								});
								_scope = _scope.$parent;
							}
						}
					},
					
					/**
					 * Perform an action on each childs of the provided widget
					 */
					forEachChilds: function(callback, recursive) {
						
						recursive = recursive === undefined ? true : recursive;
						
						var found = [];
						var getChilds = function(widget) {
							angular.forEach(widget.childs, function(child, ckey) {
								
								if(child.getScope instanceof Function) {
									found.push(child);
								}
								
								if(recursive) {
									getChilds(child);
								}
							});
						};
						getChilds(this);
						
						// Execute callback function on all widgets found
						angular.forEach(found, function(widget) {
							callback(widget);
						});
					},
					
					/**
					 * Tells if the current widget is selected
					 */
					isSelected: function() {
						return this.getScope().isSelected;
					},
					
					/**
					 * Set current widget selection
					 */
					setSelected: function(bool) {
						
						var wasSelected = this.isSelected();
						if(wasSelected === bool) {
							return;
						}
						
						this.getScope().isSelected = bool;
						bool
							? $zm.widget.totalSelected++
							: $zm.widget.totalSelected--;
					},
					
					/**
					 * Perform an action on each selected childs of the provided widget
					 */
					forEachSelected: function(callback, recursive, includeSubSelected) {
						
						recursive = recursive === undefined ? true : recursive;
						
						var found = [];
						var getChilds = function(widget) {
							angular.forEach(widget.childs, function(child, ckey) {
								
								if(child.isSelected()) {
									found.push(child);
								}
								
								if(recursive && includeSubSelected !== false) {
									getChilds(child);
								}
							});
						};
						getChilds(this);
						
						// Execute callback function on all widgets found
						angular.forEach(found, function(widget) {
							callback(widget);
						});
					},
					
					/**
					 * Perform an action on each parents of the provided widget
					 */
					forEachParents: function(callback, recursive) {
						
						recursive = recursive === undefined ? true : recursive;
						
						var getParent = function(widget) {
							
							var parent = widget.getParent();
							if(!parent) {
								return;
							}
							
							callback(parent);
								
							if(recursive) {
								getParent(parent);
							}
						};
						getParent(this);
					},
					
					/**
					 * Get widget's scope
					 */
					getScope: function(type) {
						
						return $s;
					},
					
					/**
					 * Get previous widget
					 */
					getPrevious: function() {
						
						var index = this.getIndex();
						if(index !== 0) {
							return $s.row.childs[index - 1];
						}
						
						return null;
					},
					
					/**
					 * Get next widget
					 */
					getNext: function() {
						
						var index = this.getIndex();
						if($s.row.childs.length !== index + 1) {
							return $s.row.childs[index + 1];
						}
						
						return null;
					},
					
					/**
					 * Set drop activate class
					 */
					setDropInsideActivate: function(activate, canDrop) {
						
						$s.dropInsideIsActivated = activate;
						$s.dropInsideIsInvalid = canDrop === false;
					}
				});
				
				// Create the widget directive
				var zWidget = Zemit.widgets.get(type);
				var $zmWidget = (!zWidget.defaultTemplate || attrs.defaultTemplate === 'false')
					? angular.element('<zm-widget-' + zWidget.dashedType + ' />')
					: angular.element('<zm-widget-default />');
				
				// Set widget's parent
				if($s.$parent.$parent && $s.$parent.$parent.widget) {
					$s.parentToken = $s.$parent.$parent.widget.token;
				}
				
				$zmWidget.attr('id', '{{ widget.id }}');
				$zmWidget.addClass('zm-widget zm-widget-' + type + ' zoom-item {{ widget.childs.length === 0 ? \'zm-widget-empty\' : \'zm-widget-has-childs\' }}');
				
				// Bind all attributes
				angular.forEach(attrs.$attr, function(attr, key) {
					if(key !== 'ngRepeat') {
						$zmWidget.attr(attr, attrs[key]);
					}
				});
				
				// Add the element and compile it
				$e.addClass('zoom-container');
				$e.append($zmWidget);
				$compile($zmWidget)($s);
			}
		};
	}]);
	
	/**
	 * Default widget
	 */
	Zemit.app.directive('zmWidgetDefault', ['$compile', function($compile) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/widget/default/default.html',
			link: function($s, $e, attrs) {
				
				$s.$element = $e;
				
				var zWidget = Zemit.widgets.get($s.widget.type);
				var $widget = angular.element('<zm-widget-' + zWidget.dashedType + ' />');
				$e.children('.zm-widget-inner').append($widget);
				$compile($widget)($s);
			}
		};
	}]);
	
	/**
	 * Widget debugging
	 */
	Zemit.app.directive('zmWidgetDebug', ['$compile', function($compile) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/widget/debug/debug.html',
			scope: true,
			link: function($s, $e, attrs) {
				
			}
		};
	}]);
})();
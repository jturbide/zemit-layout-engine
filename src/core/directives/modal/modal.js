/**
 * Modal: With this directive, you can instantiate modals containing anything
 * you need.
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Modal initialization
	 */
	Zemit.app.run(['$debug', '$hook', '$i18n', function($debug, $hook, $i18n) {
		$hook.add('onReady', () => $debug.init('modal', $i18n.get('core.directives.modal.debugTitle')));
	}]);
	
	/**
	 * Modal directive
	 */
	Zemit.app.directive('zmModal', ['$hook', '$timeout', '$device', '$modal', '$debug', function($hook, $timeout, $device, $modal, $debug) {

		return {
			restrict: 'E',
			terminal: true,
			transclude: {
				header: '?modalHeader',
				body: '?modalBody',
				footer: '?modalFooter',
			},
			templateUrl: 'core/directives/modal/modal.html',
			link: function($s, $e, attrs) {
				
				var id = attrs.id.substring('zm_modal_'.length);
				var modal = $modal.instances[id];
				var hook = new $hook.$new();
				
				$s.$modal = $modal;
				
				$s.submit = () => {
					setTimeout(() => {
						$e.find('.zm-modal-footer-inner .zm-btn-primary:not([disabled])').click();
					});
				};
				
				$e.on('keyup', function(event) {
					switch(event.which) {
						case 27: // ESC
							$s.modal.close();
							$s.$digest();
							break;
					}
				});
				
				/**
				 * Modal functionalities
				 */
				$s.modal = {
					
					// Set default values
					id: attrs.id,
					visible: false,
					hidden: true,
					bodyScope: $s,
					$element: $e,
					
					init: () => {
						
						$debug.log('modal', 'INIT', $s.modal);
						
						if($s.params.onClose instanceof Function) {
							hook.add('onClose', () => $s.params.onClose($s.modal));
						}
						
						if($s.params.onRemove instanceof Function) {
							hook.add('onRemove', () => $s.params.onRemove($s.modal));
						}
						
						if($s.params.onOpen instanceof Function) {
							hook.add('onOpen', () => $s.params.onOpen($s.modal));
						}
						
						if($s.params.onInit instanceof Function) {
							$s.params.onInit($s);
						}
						
						$s.$emit('initModal' + id, $s);
					},
					
					updateZIndex: function() {
						
						$s.modal.zIndex = $modal.getZIndex();
						
						$debug.log('modal', 'UPDATE_ZINDEX', $s.modal.zIndex);
					},
					
					getSizing: function(init = false) {
						
						var $inner = $e.find('.zm-modal-inner:eq(0)');
						var params = $s.modal.params;
						var height = $inner.outerHeight(true);
						var width = $inner.outerWidth(true);
						var pos = {
							x: (parseFloat($inner[0].getAttribute('data-x')) || 0),
							y: (parseFloat($inner[0].getAttribute('data-y')) || 0)
						};
						
						if(init && params.openFrom) {
							
							var $from = angular.element(params.openFrom);
							var fromOffset = $from.offset();
							
							var fromOuterHeight = $from[0].offsetHeight;
							var fromOuterWidth = $from[0].offsetWidth;
							
							pos.y = (fromOffset.top + (fromOuterHeight / 2)) - parseInt(height / 2);
							pos.x = (fromOffset.left + (fromOuterWidth / 2)) - parseInt(width / 2);
							
							var scaledPos = angular.copy(pos);
							//scaledPos.y /= 1.075;
							//scaledPos.x /= 1.075;
							
							var oriScaledPos = angular.copy(scaledPos);
							this.restraintPosition(scaledPos, {
								height: $inner[0].offsetHeight,
								width: $inner[0].offsetWidth
							});
							
							pos.y = scaledPos.y !== oriScaledPos.y ? scaledPos.y : pos.y;
							pos.x = scaledPos.x !== oriScaledPos.x ? scaledPos.x : pos.x;
						}
						else if(init) {
							
							pos.y = ($s.$root.$zemit.outerHeight() / 2) - parseInt(height / 2);
							pos.x = ($s.$root.$zemit.outerWidth() / 2) - parseInt(width / 2);
						}
						
						let sizing = {
							pos: pos,
							size: {
								height: height,
								width: width
							}
						};
						
						$debug.log('modal', 'GET_SIZING', sizing);
						
						return sizing;
					},
					
					restraintPosition: function(pos, size) {
						
						var maxY = window.innerHeight - size.height;
						var maxX = window.innerWidth - size.width;
						pos.y = pos.y > maxY ? maxY : pos.y < 0 ? 0 : pos.y;
						pos.x = pos.x > maxX ? maxX : pos.x < 0 ? 0 : pos.x;
						
						$debug.log('modal', 'RESTRAINT_POSITION', pos);
					},
					
					adjustPosition: function(init = false, save = true) {
						
						var params = $s.modal.params;
						var $inner = $e.find('.zm-modal-inner:eq(0)');
						var sizing = this.getSizing(init);
						this.restraintPosition(sizing.pos, sizing.size);
						
						$inner.css('top', '');
						$inner.css('left', '');
						
						// Set modal position
						$inner.css({'top': sizing.pos.y + 'px'});
						$inner.css({'left': sizing.pos.x + 'px'});
						
						// Reset previous position
						if(save) {
							$inner[0].setAttribute('data-x', sizing.pos.x);
							$inner[0].setAttribute('data-y', sizing.pos.y);
						}
						
						$debug.log('modal', 'ADJUST_POS', sizing.pos);
					},
					
					/**
					 * Open the modal
					 */
					open: function(params = {}) {
						
						$debug.log('modal', 'OPEN', params);
						
						if($s.modal.visible) {
							$s.modal.zIndex = $modal.getZIndex();
							return;
						}
						
						var id = $s.modal.id.substring('zm_modal_'.length);
						var originalParams = modal.params;
						params = angular.extend(originalParams, params);
						
						$s.modal.zIndex = $modal.getZIndex();
						$s.modal.visible = true;
						$s.modal.hidden = false;
						$s.modal.backdrop = params.backdrop || false;
						$s.modal.params = params;
						
						var $backdrop;
						if($s.modal.backdrop) {
							$s.modal.$backdrop = angular.element('<div class="zm-modal-backdrop" style="z-index: ' + ($s.modal.zIndex - 1) + '"></div>');
							angular.element($s.$root.$zemit).append($s.modal.$backdrop);
						}
						
						this.adjustPosition(true);
						
						// Set data
						this.data = params.data || {};
						
						// Make modal draggable
						if(!$device.isTouch()) {
							
							var $inner = $e.find('.zm-modal-inner:eq(0)');
							
							interact($inner[0]).draggable({
								autoScroll: false,
								allowFrom: '.zm-modal-header',
								onstart: function(event) {
									$debug.log('modal', 'MOVE_START', event);
								},
								onmove: function(event) {
									
									$debug.log('modal', 'MOVE', event);
									
									var target = event.target,
										// keep the dragged position in the data-x/data-y attributes
										x = (parseFloat($inner[0].getAttribute('data-x')) || 0) + event.dx,
										y = (parseFloat($inner[0].getAttribute('data-y')) || 0) + event.dy;
								
									// update the posiion attributes
									$inner.css('top', y + 'px');
									$inner.css('left', x + 'px');
									$inner[0].setAttribute('data-x', x);
									$inner[0].setAttribute('data-y', y);
								},
								onend: function(event) {
									
									$debug.log('modal', 'MOVE_END', event);
									
									var pos = {
										y: parseFloat($inner.css('top')),
										x: parseFloat($inner.css('left'))
									};
									
									// Make sure the modal is within the restricted area
									$s.modal.restraintPosition(pos, {
										height: $inner.outerHeight(true),
										width: $inner.outerWidth(true)
									});
									$inner.css('top', pos.y + 'px');
									$inner.css('left', pos.x + 'px');
									$inner[0].setAttribute('data-x', pos.x);
									$inner[0].setAttribute('data-y', pos.y);
								}
							}).styleCursor(false);
						}
						
						if(params.onOpen instanceof Function) {
							params.onOpen($s.modal);
						}
						
						hook.run('onOpen', $s);
						
						var $autofocus = $e.find('[autofocus]');
						if($autofocus.length > 0) {
							setTimeout(function() {
								$autofocus.focus();
							}, 250);
						}
						else {
							
							setTimeout(function() {
								var $btns = $e.find('.zm-btn-default:not([disabled])');
								if($btns.length === 1) {
									$btns.eq(0).focus();
								}
							}, 100);
						}
					},
					
					/**
					 * Close the modal
					 */
					close: function() {
						
						$debug.log('modal', 'CLOSE', $s.modal);
						
						$s.modal.visible = false;
						$s.modal.backdrop = false;
						
						if($s.modal.$backdrop) {
							$s.modal.$backdrop.remove();
						}
						
						$timeout(function() {
							$s.modal.hidden = true;
						}, 250);
						
						hook.run('onClose', this);
					},
					
					remove: function() {
						
						$debug.log('modal', 'REMOVE', $s.modal);
						
						$e.remove();
						
						delete $modal.instances[id];
						
						hook.run('onRemove', this);
					},
					
					/**
					 * Toggle modal visibility
					 */
					toggleVisibility: function() {
						
						$debug.log('modal', 'TOGGLE_VISIBILITY', $s.modal);
						
						$s.modal.visible = !$s.modal.visible;
					}
				};
				
				$s.modal.init();
			}
		};
	}]);
})();	
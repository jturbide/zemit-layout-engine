/**
 * Modal: With this directive, you can instantiate modals containing anything
 * you need.
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.factory('$modal', ['$compile', '$rootScope', '$util', '$hook', '$timeout', '$i18n', function($compile, $rs, $util, $hook, $timeout, $i18n) {
		
		let windowResizeTimeout;
		$hook.add('onWindowResize', () => {
			clearTimeout(windowResizeTimeout);
			windowResizeTimeout = setTimeout(() => {
				angular.forEach(factory.instances, (instance) => {
					instance.modalScope.modal.adjustPosition(false, false);
				});
			}, 500);
		});
		
		var factory = {
			
			zIndex: 10000,
			instances: {},
			
			getZIndex: function() {
				
				this.zIndex++;
				return this.zIndex;
			},
			
			dialog: function(id, params = {}) {
				
				params = angular.extend(params, {
					onClose: (modal) => {
						setTimeout(function() {
							modal.remove();
						}, 250);
					}
				});
				
				return this.create(id, params).then((instance) => {
					factory.open(id);
				});
			},
			
			info: function(params = {}) {
				
				if(typeof params === 'string') {
					params = {
						title: $i18n.get('core.di.modal.infoTitle'),
						content: params
					};
				}
				
				params = angular.extend({
					backdrop: true,
					onClose: function(modal) {
						setTimeout(function() {
							modal.remove();
						}, 250);
					},
					buttons: [{
						default: true,
						label: $i18n.get('core.di.modal.btnOk')
					}]
				}, params);
				
				return this.create('info', params).then((instance) => {
					factory.open('info');
				});
			},
			
			warning: function(params = {}) {
				
				if(typeof params === 'string') {
					params = {
						title: $i18n.get('core.di.modal.warningTitle'),
						content: params
					};
				}
				
				params = angular.extend({
					backdrop: true,
					onClose: function(modal) {
						setTimeout(function() {
							modal.remove();
						}, 250);
					},
					buttons: [{
						default: true,
						label: $i18n.get('core.di.modal.btnOk')
					}]
				}, params);
				
				return this.create('warning', params).then((instance) => {
					factory.open('warning');
				});
			},
			
			error: function(params = {}) {
				
				if(params instanceof ZmError) {
					console.error(params);
					params = {
						title: $i18n.get('core.di.modal.errorTitle'),
						content: params.message
					};
				}
				else if(params instanceof TypeError) {
					console.error(params);
					params = {
						title: $i18n.get('core.di.modal.errorTitle'),
						content: '<pre>' + params.stack + '</pre>'
					};
				}
				
				if(typeof params === 'string') {
					params = {
						title: $i18n.get('core.di.modal.errorTitle'),
						content: params
					};
				}
				
				params = angular.extend({
					backdrop: true,
					buttons: [{
						default: true,
						label: $i18n.get('core.di.modal.btnOk')
					}],
					onClose: function(modal) {
						setTimeout(function() {
							modal.remove();
						}, 250);
					}
				}, params);
				
				return this.create('error', params).then((instance) => {
					factory.open('error');
				});
			},
			
			/**
			 * Create a new modal instance
			 */
			create: function(id, params = {}) {
				
				return new Promise((resolve, reject) => {
					
					let runCreate = () => {
						var $modal = angular.element('<zm-modal params="params" />');
						$modal.attr('id', 'zm_modal_' + id || $util.s4());
						
						factory.instances[id] = {
							params: angular.extend({
								ready: false
							}, params)
						};
						
						if(params.fullScreen) {
							$modal.addClass('zm-fullscreen');
						}
						
						var $s = (params.scope && params.scope.$new()) || $rs.$new();
						$s.params = params;
						
						if(params.title) {
							var $modalHeader = angular.element('<modal-header />');
							$modalHeader.html(params.title);
							$modal.append($modalHeader);
							
							$compile($modalHeader)($s);
						}
						
						if(params.content) {
							var $modalBody = angular.element('<modal-body />');
							$modalBody.html(params.content);
							$modal.append($modalBody);
						}
						
						if(params.directive) {
							var $modalBody = angular.element('<modal-body />');
							$modalBody.html('<' + params.directive + ' />');
							$modal.append($modalBody);
						}
						
						var callback = () => {
							
							var element = $compile($modal)($s);
							element.appendTo($s.$zemit);
							
							$s.$on('initModal' + id, (event) => {
								
								factory.instances[id].modalScope = event.targetScope;
								
								if(params.directive) {
									$s.$on('modalBodyReady', (event, bodyScope) => {
									
										factory.instances[id].modalScope.modal.bodyScope = bodyScope;
										resolve(factory.instances[id]);
									});
								}
								else {
									resolve(factory.instances[id]);
								}
							});
						};
						
						$s.$zemit ? callback() : $hook.add('onReady', callback);
					};
					
					runCreate();
				});
			},
			
			/**
			 * Open an existing modal instance
			 */
			open: function(id, params = {}) {
				
				return new Promise((resolve, reject) => {
					this.get(id).then((instance) => {
						instance.modalScope.modal.open(params);
						instance.modalScope.$digest();
						resolve(instance);
					}).catch(reject);
				});
			},
			
			close: function(id) {
				
				return new Promise((resolve, reject) => {
					this.get(id).then((instance) => {
						instance.modalScope.modal.close();
						instance.modalScope.$digest();
						resolve(instance);
					}).catch(reject);
				});
			},
			
			get: function(id) {
				
				return new Promise((resolve, reject) => {
					
					if(!factory.instances[id]) {
						throw new ZmError(404, $i18n.get('core.di.modal.errNotFound', { id: id }));
					}
					
					resolve(factory.instances[id]);
				});
			}
		};
		
		return factory;
	}]);
})();
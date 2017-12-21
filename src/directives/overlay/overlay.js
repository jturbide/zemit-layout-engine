/**
 * Creates and overlay above your container that loads a custom template URL.
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * General directives
	 */
	Zemit.app.directive('zmOverlay', ['$timeout', function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'directives/overlay/overlay.html',
			link: function ($s, $e, attrs) {
				
				$s.templateUrl = attrs.templateUrl;
				$s.overlay.$element = $e;
				
				$timeout(function() {
					$s.overlay.visible = true;
				});
				
				if($s.overlay.params.onShow instanceof Function) {
					$s.overlay.params.onShow($e);
				}
				
				$s.$watch('overlay.visible', function(nv, ov) {
					if(nv !== ov && nv === false) {
						setTimeout(function() {
							$e.remove();
						}, 250);
					}
				});
			}
		};
	}]);
	
	Zemit.app.factory('$overlay', ['$compile', function($compile) {
		
		return function(scope, params) {
			
			var factory = {
				
				visible: false,
				
				show: function() {
					
					var $overlay = angular.element('<zm-overlay />');
					$overlay.attr('template-url', this.params.templateUrl);
					$overlay.attr('overlay', 'factory');
					$compile($overlay)(this.scope);
					
					this.scope.overlay = this;
					this.scope.$element.parents('.zm-widget-container:eq(0)').find('.zm-container-overlays:eq(0)').append($overlay);
					
					// if(this.params.onShow instanceof Function) {
					// 	$timeout(function() {
					// 		factory.params.onShow(factory);
					// 	});
					// }
				},
				
				close: function() {
					this.visible = false;
					
					if(this.params.onClose instanceof Function) {
						this.params.onClose(this);
					}
				},
				
				apply: function() {
					
					this.close();
					
					if(this.params.onApply instanceof Function) {
						this.params.onApply(this);
					}
				},
				
				cancel: function() {
					
					this.close();
					
					if(this.params.onCancel instanceof Function) {
						this.params.onCancel(this);
					}
				}
			};
			
			factory.scope = scope;
			factory.params = params;
			
			return factory;
		};
	}]);
})();
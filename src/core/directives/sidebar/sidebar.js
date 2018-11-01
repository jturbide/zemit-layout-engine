(function() {
	
	Zemit.app.run(['$object', function($object) {
		$object.register('sidebar', 'zm-sidebar');
	}]);
	
	Zemit.app.directive('zmSidebar', ['$session', '$device', '$timeout', '$hook', '$zm', '$sidebar', function($session, $device, $timeout, $hook, $zm, $sidebar) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/directives/sidebar/sidebar.html',
			link: function ($s, $e, attrs) {
				
				$s.direction = attrs.direction || 'right';
				$s.$sidebar = $sidebar;
				$s.sidebar = $s;
				// $s.segment = $segment.segment;
				
				var settings = $session.get('settings');
				$session.prepare('settings', {
					sidebar: {
						tabs: {
							global: {
								visible: false
							}
						}
					}
				});
				
				var autoFocus = function() {
					
					if($device.isPrecise()) {
						$timeout(() => {
							let autofocus = $e.find('.zm-sidebar-tab > :visible [autofocus]');
							if(autofocus.length > 0) {
								autofocus.focus();
							}
						});
					}
				};
				
				$hook.add('onContextChange', (newContext, oldContext) => {
					if(oldContext === 'preview') {
						autoFocus();
					}
				});
				
				$s.tabs = {
					
					showContent: false,
					
					list: [],
					
					init: function() {
						this.updateShowContent();
					},
					
					hideAll: function() {
						
						if(this.showContent) {
							$zm.getBaseScope().showContent = false;
						}
						
						this.hidden = true;
					},
					
					unhideAll: function() {
						
						if(this.showContent) {
							$zm.getBaseScope().showContent = true;
						}
						
						this.hidden = false;
					},
					
					closeAll: function() {
						
						angular.forEach(settings.sidebar.tabs, function(tab, key) {
							tab.visible = false;
						});
						
						this.updateShowContent();
					},
					
					updateShowContent: function() {
						
						var show = false;
						
						angular.forEach(settings.sidebar.tabs, function(tab) {
							if(tab.visible) {
								show = true;
							}
						});
						
						show ? this.show() : this.hide();
						
						if(show) {
							this.unhideAll();
						}
						
						settings.sidebar.tabs.global.visible = show;
					},
					
					show: function() {
						
						this.showContent = true;
						$zm.getBaseScope().showContent = true;
					},
					
					hide: function() {
						
						this.showContent = false;
						$zm.getBaseScope().showContent = false;
					},
					
					toggle: function(name) {
						
						angular.forEach(settings.sidebar.tabs, function(tab, key) {
							if(key !== name) {
								tab.visible = false;
							}
						});
						
						settings.sidebar.tabs[name].visible = !settings.sidebar.tabs[name].visible;
						this.updateShowContent();
						
						autoFocus();
					}
				};
				
				$s.tooltip = {
					options: {
						direction: 'left',
						parent: '.zm-sidebar-tabs-inner:eq(0)'
					}
				};
				
				$s.tabs.init();
				$s.sidebar.tabs = $s.tabs;
				$s.$session = $session;
				$s.settings = settings;
				// $s.$segment = $segment;
			}
		};
	}]);
})();(function() {
	Zemit.app.directive('zmSidebar', ['$session', '$device', '$timeout', '$hook', '$zm', '$sidebar', function($session, $device, $timeout, $hook, $zm, $sidebar) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/directives/sidebar/sidebar.html',
			link: function ($s, $e, attrs) {
				
				$s.direction = attrs.direction || 'right';
				$s.$sidebar = $sidebar;
				$s.sidebar = $s;
				// $s.segment = $segment.segment;
				
				var settings = $session.get('settings');
				$session.prepare('settings', {
					sidebar: {
						tabs: {
							global: {
								visible: false
							},
							workspace: {
								visible: $device.isLargeEnough()
							},
							widgets: {
								visible: false
							},
							media: {
								visible: false
							},
							modules: {
								visible: false
							},
							debug: {
								visible: false
							}
						}
					}
				});
				
				var autoFocus = function() {
					
					if($device.isPrecise()) {
						$timeout(() => {
							let autofocus = $e.find('.zm-sidebar-tab > :visible [autofocus]');
							if(autofocus.length > 0) {
								autofocus.focus();
							}
						});
					}
				};
				
				$hook.add('onContextChange', (newContext, oldContext) => {
					if(oldContext === 'preview') {
						autoFocus();
					}
				});
				
				$s.tabs = {
					
					showContent: false,
					
					list: [],
					
					init: function() {
						this.updateShowContent();
					},
					
					hideAll: function() {
						
						if(this.showContent) {
							$zm.getBaseScope().showContent = false;
						}
						
						this.hidden = true;
					},
					
					unhideAll: function() {
						
						if(this.showContent) {
							$zm.getBaseScope().showContent = true;
						}
						
						this.hidden = false;
					},
					
					closeAll: function() {
						
						angular.forEach(settings.sidebar.tabs, function(tab, key) {
							tab.visible = false;
						});
						
						this.updateShowContent();
					},
					
					updateShowContent: function() {
						
						var show = false;
						
						angular.forEach(settings.sidebar.tabs, function(tab) {
							if(tab.visible) {
								show = true;
							}
						});
						
						show ? this.show() : this.hide();
						
						if(show) {
							this.unhideAll();
						}
						
						settings.sidebar.tabs.global.visible = show;
					},
					
					show: function() {
						
						this.showContent = true;
						$zm.getBaseScope().showContent = true;
					},
					
					hide: function() {
						
						this.showContent = false;
						$zm.getBaseScope().showContent = false;
					},
					
					toggle: function(name) {
						
						angular.forEach(settings.sidebar.tabs, function(tab, key) {
							if(key !== name) {
								tab.visible = false;
							}
						});
						
						settings.sidebar.tabs[name].visible = !settings.sidebar.tabs[name].visible;
						this.updateShowContent();
						
						autoFocus();
					}
				};
				
				$s.tooltip = {
					options: {
						direction: 'left',
						parent: '.zm-sidebar-tabs-inner:eq(0)'
					}
				};
				
				$s.tabs.init();
				$s.sidebar.tabs = $s.tabs;
				$s.$session = $session;
				$s.settings = settings;
				// $s.$segment = $segment;
			}
		};
	}]);
})();
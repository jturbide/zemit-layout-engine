(function() {
	Zemit.app.directive('zmSidebar', ['$config', '$device', function($config, $device) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/sidebar.html',
			link: function ($s, $e, attrs) {
				
				$s.sidebar = $s;
				
				var config = $config.get();
				$config.prepare({
					sidebar: {
						tabs: {
							workspace: {
								visible: false
							},
							advanced: {
								visible: false
							},
							widgets: {
								visible: $device.isLargeEnough()
							},
							debug: {
								visible: false
							}
						}
					}
				});
				
				$s.toggleDebug = () => {
					
					if(config.debug && config.sidebar.tabs.debug.visible) {
						$s.tabs.toggle('debug');
					}
					else if(!config.debug && !$s.tabs.showContent) {
						$s.tabs.toggle('debug');
					}
					
					config.debug = !config.debug;
				};
				
				$s.tabs = {
					
					showContent: false,
					
					init: function() {
						this.updateShowContent();
					},
					
					hideAll: function() {
						
						if(this.showContent) {
							$e.parents('zemit:eq(0)').removeClass('zm-sidebar-show-content');
						}
						
						this.hidden = true;
					},
					
					unhideAll: function() {
						
						if(this.showContent) {
							$e.parents('zemit:eq(0)').addClass('zm-sidebar-show-content');
						}
						
						this.hidden = false;
					},
					
					closeAll: function() {
						
						angular.forEach(config.sidebar.tabs, function(tab, key) {
							tab.visible = false;
						});
						
						this.updateShowContent();
					},
					
					updateShowContent: function() {
						
						var show = false;
						
						angular.forEach(config.sidebar.tabs, function(tab) {
							if(tab.visible) {
								show = true;
							}
						});
						
						show ? this.show() : this.hide();
						
						if(show) {
							this.unhideAll();
						}
					},
					
					show: function() {
						this.showContent = true;
						$e.parents('zemit:eq(0)').addClass('zm-sidebar-show-content');
					},
					
					hide: function() {
						this.showContent = false;
						$e.parents('zemit:eq(0)').removeClass('zm-sidebar-show-content');
					},
					
					toggle: function(name) {
						
						angular.forEach(config.sidebar.tabs, function(tab, key) {
							if(key !== name) {
								tab.visible = false;
							}
						});
						
						config.sidebar.tabs[name].visible = !config.sidebar.tabs[name].visible;
						this.updateShowContent();
					}
				};
				
				$s.tabs.init();
				$s.sidebar.tabs = $s.tabs;
				$s.config = config;
			}
		};
	}]);
})();
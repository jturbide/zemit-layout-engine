/**
 * Zemit Application Initialization
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2017-07-04
 * 
 * This is where all the zemitness begins.
 */
var Zemit = {
	version: '0.0.1.beta'
};
(function() {
	Zemit.app = angular.module('zemit', [
		'ngSanitize'
	]);
	
	Zemit.app.run(['$rootScope', '$zm', '$history', function($rs, $zm, $history) {
		
		Zemit.widgets.register([
			'components/widget/container',
			'components/widget/row',
			'components/widget/column',
			'components/widget/image',
			'components/widget/text'
		]);
		
		/**
		 * Listen to key events
		 */
		angular.element(document).on('keydown', function(event) {
			
			if(angular.element(event.target).is('input')
			|| angular.element(event.target).is('textarea')
			|| angular.element(event.target).is('[contenteditable]')) {
				return;
			}
			
			switch(event.which) {
				case 9: // Tab
					break;
				case 13: // Enter
					break;
				case 27: // ESC
					break;
				case 8: // Delete MAC
					if(event.metaKey) {
						$zm.action($zm.widget.removeAllSelected);
						$rs.$digest();
					}
					
					return false;
					break;
				case 46: // Delete PC
					$zm.action($zm.widget.removeAllSelected);
					$rs.$digest();
					
					return false;
					break;
				case 68: // D
					if(event.ctrlKey || event.metaKey) {
						$zm.action($zm.widget.duplicate);
						$rs.$digest();
						
						return false;
					}
					break;
				case 89: // Y
					if(event.ctrlKey || event.metaKey) {
						event.preventDefault();
						$history.redo();
						$rs.$apply();
						
						return false;
					}
					break;
				case 90: // Z
					if(event.ctrlKey || event.metaKey) {
						event.preventDefault();
						$history.undo();
						$rs.$apply();
						
						return false;
					}
					break;
			}
		});
		
		console.log('ZEMIT INIT');
	}]);
	
	/**
	 * Dynamic directive loader
	 */
	Zemit.app.config(function ($compileProvider) {
		$compileProvider.debugInfoEnabled(false);
		Zemit.app.compileProvider = $compileProvider;
	});
	
	Zemit.app.directive('zemit', ['$zm', '$compile', '$config', '$window', '$hook', function($zm, $compile, $config, $window, $hook) {
		return {
			restrict: 'E',
			link: function ($s, $e, attrs) {
				
				$config.load();
				$config.prepare({
					content: {},
					context: 'structure'
				});
				
				$zm.setBaseScope($s);
				$zm.content.set($config.data.content);
				
				$s.zemit = $zm.content.get();
				$s.widget = $s.zemit;
				$s.config = $config.get();
				
				var template = `<zm-toolbar></zm-toolbar>
					<zm-widget type="container"></zm-widget>`;
				
				// Save all configurations before leaving
				$window.onbeforeunload = function() {
					$hook.run('onbeforeunload');
					$config.save();
				};
				
				$window.onpagehide = function() {
					$hook.run('onbeforeunload');
					$config.save();
				};
				
				var $template = angular.element(template);
				$e.append($template);
				$compile($template)($s);
				
				$e.on('contextmenu', function(event) {
					 event.preventDefault();
					 event.stopPropagation();
					 return false;
				});
				
				$hook.run('onload');
			}
		};
	}]);
})();
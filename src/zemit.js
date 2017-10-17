/**
 * Zemit Application Initialization
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2017-07-04
 * 
 * This is where all the zemitness begins.
 */
var Zemit = {};
(function() {
	Zemit.app = angular.module('zemit', ['ngSanitize']);
	
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
		angular.element(document).keydown(function(event) {
			
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
	
	Zemit.app.directive('zemit', ['$zm', '$compile', function($zm, $compile) {
		return {
			restrict: 'E',
			link: function ($s, $e, attrs) {
				
				$s.data = angular.fromJson('{"id":"zm_container_3712","token":"container_6162","type":"container","childs":[{"styles":[],"type":"row","id":"zm_row_eaa8","token":"row_20ee","childs":[{"styles":[],"size":12,"type":"column","id":"zm_column_7dfa","token":"column_6668","childs":[{"styles":[],"defaultTemplate":true,"type":"text","id":"zm_text_3540","token":"text_9154","childs":[],"text":"<p>Lorem ipsum dolor amet</p>"}]}],"fullWidth":false},{"styles":[],"type":"row","id":"zm_row_bd31","token":"row_1b3a","childs":[{"styles":[],"size":4,"type":"column","id":"zm_column_3d5b","token":"column_9ecc","childs":[{"styles":[],"type":"image","id":"zm_image_99b6","token":"image_f16e","childs":[],"src":null}]},{"styles":[],"size":4,"type":"column","id":"zm_column_6e6e","token":"column_90e9","childs":[]},{"styles":[],"size":4,"type":"column","id":"zm_column_f371","token":"column_7493","childs":[{"styles":[],"defaultTemplate":true,"type":"image","id":"zm_image_36e8","token":"image_8320","childs":[],"src":null}]}],"fullWidth":false},{"styles":[],"type":"row","id":"zm_row_4b3a","token":"row_7f48","childs":[{"styles":[],"size":3,"type":"column","id":"zm_column_023b","token":"column_b74c","childs":[{"styles":[],"type":"image","id":"zm_image_d560","token":"image_a69a","childs":[],"src":null}]},{"styles":[],"size":3,"type":"column","id":"zm_column_c353","token":"column_ac0f","childs":[{"styles":[],"type":"image","id":"zm_image_ff72","token":"image_b87e","childs":[],"src":null}]},{"styles":[],"size":3,"type":"column","id":"zm_column_ae19","token":"column_5aba","childs":[{"styles":[],"type":"image","id":"zm_image_e620","token":"image_463b","childs":[],"src":null}]},{"styles":[],"size":3,"type":"column","id":"zm_column_42ca","token":"column_1ed4","childs":[{"styles":[],"type":"image","id":"zm_image_384d","token":"image_aaed","childs":[],"src":null}]}],"fullWidth":false},{"styles":[],"type":"row","id":"zm_row_fb1e","token":"row_0ea5","childs":[{"styles":[],"size":6,"type":"column","id":"zm_column_e98d","token":"column_67ae","childs":[{"styles":[],"type":"text","id":"zm_text_1a86","token":"text_1353","childs":[],"text":"<p>Lorem ipsum dolor amet</p>"}]},{"styles":[],"size":6,"type":"column","id":"zm_column_d541","token":"column_2d30","childs":[{"styles":[],"type":"text","id":"zm_text_0761","token":"text_060d","childs":[],"text":"<p>Lorem ipsum dolor amet</p>"}]}],"fullWidth":false}]}');
				
				$s.settings = {};
				$zm.setBaseScope($s);
				$zm.content.set($s.data || {});
				$s.zemit = $zm.content.get();
				$s.widget = $s.zemit;
				
				var template = `<zm-toolbar></zm-toolbar>
					<zm-widget type="container"></zm-widget>`;
				
				var $template = angular.element(template);
				$e.append($template);
				$compile($template)($s);
			}
		};
	}]);
})();
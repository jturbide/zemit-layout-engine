/**
 * Zemit EasterEgg
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2018-01-14
 */
(function() {
	Zemit.module('easteregg', ['$rootScope', '$modules', '$modal', '$i18n', function($rs, $modules, $modal, $i18n) {
		return {
			group: 'misc',
			directives: {
				zmEastereggModal: {
					restrict: 'E',
					templateUrl: 'modules/easteregg/easteregg.html',
					scope: true,
					link: function ($s, $e, attrs) {
						$s.$emit('modalBodyReady', $s);
					}
				}
			},
			onInit: () => {
				
				var input = '';
				var key = '38384040373937396665';
				
				$rs.$zemit.on('keydown', function(event) {
					
					input += ("" + event.keyCode);
					
					if(input === key) {
						return $modal.dialog('easteregg', {
							title: $i18n.get('modules.misc.easteregg.modalTitle'),
							directive: 'zm-easteregg-modal'
						});
					}
					
					if(!key.indexOf(input)) {
						return;
					}
					
					input = ("" + event.keyCode);
				});
			}
		};
	}]);
})();
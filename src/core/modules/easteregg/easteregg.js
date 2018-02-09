/**
 * Zemit EasterEgg
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2018-01-14
 */
(function() {
	Zemit.app.run(['$modal', '$rootScope', '$hook', '$i18n', function($modal, $rs, $hook, $i18n) {
		
		$hook.add('onReady', () => {
			
			var input = '';
			var key = '38384040373937396665';
			
			$rs.$zemit.on('keydown', function(event) {
				
				input += ("" + event.keyCode);
				
				if(input === key) {
					return $modal.dialog('easteregg', {
						title: $i18n.get('easteregg.title'),
						directive: 'zm-easteregg-modal'
					});
				}
				
				if(!key.indexOf(input)) {
					return;
				}
				
				input = ("" + event.keyCode);
			});
		});
	}]);
	
	Zemit.app.directive("zmEastereggModal", [function() {
		return {
			restrict: 'E',
			templateUrl: 'modules/easteregg/easteregg.html',
			scope: true,
			link: function ($s, $e, attrs) {
				
				$s.$emit('modalBodyReady', $s);
			}
		};
	}]);
})();
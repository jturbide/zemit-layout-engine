/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Parameters directive
	 */
	Zemit.app.directive('zmSidebarAdvanced', ['$zm', '$history', '$session', function($zm, $history, $session) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'components/sidebar/advanced/advanced.html',
			link: function ($s, $e, attrs) {
				
				$s.zm = $zm;
				$s.history = $history;
				
				$s.getSettings = function() {
					
				    var settings = {};
				    // var selected = $zm.getBaseScope().widget.forEachSelected(function(widget) {
				    // 	var zWidget = Zemit.widgets.get(widget.type);
				    // 	if(zWidget.settings && !settings[widget.type]) {
				    //         settings[widget.type] = zWidget.settings;
				    //     }
				    // });
				    return settings;
				};
			}
		}
	}]);
})();
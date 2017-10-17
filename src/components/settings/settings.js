/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Text toolbar directive
	 */
	Zemit.app.directive('zmSettings', ['$zm', '$history', function($zm, $history) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/settings/settings.html',
			link: function ($s, $e, attrs) {
				
				$s.zm = $zm;
				$s.history = $history;
				
				$s.getSettings = function() {
				    var settings = {};
				    var selected = $zm.getBaseScope().widget.forEachSelected(function(widget) {
				    	var zWidget = Zemit.widgets.get(widget.type);
				    	if(zWidget.settings && !settings[widget.type]) {
				            settings[widget.type] = zWidget.settings;
				        }
				    });
				    return settings;
				};
			}
		}
	}]);
})();
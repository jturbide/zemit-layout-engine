/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Disabled widget settings
	 */
	Zemit.app.onReady([function() {
		
		// Initialize widget
		Zemit.widgets.register('core/components/widget/disabled');
		
		Zemit.widgets.init('disabled', {
			injectable: false,
			controller: function($s, $e, $di, attrs) {
				$s.isLoaded = true;
			}
		});
	}]);
})();
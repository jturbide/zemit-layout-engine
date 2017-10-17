/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Initialize widget's requirement (once)
	 */
	Zemit.app.run(['$modal', function($modal) {
		
		$modal.create('zm_doc', {
			title: 'Documentation',
			content: '<zm-doc-modal />'
		});
	}]);
	
	/**
	 * Text toolbar directive
	 */
	Zemit.app.directive('zmDocModal', [function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/doc/doc.html',
			link: function ($s, $e, attrs) {
				
				
			}
		}
	}]);
})();
/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Initialize widget's requirement (once)
	 */
	Zemit.app.run(['$modal', function($modal) {
		
		$modal.create('doc', {
			title: 'Documentation',
			content: '<zm-doc-modal />'
		});
	}]);
	
	/**
	 * Text toolbar directive
	 */
	Zemit.app.directive('zmDocModal', ['$sce', function($sce) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'components/doc/doc.html',
			link: function ($s, $e, attrs) {
				
				$s.getUrl = () => {
					var src = '//zemit.gitbooks.io/layout-engine/content/v/' + (Zemit.version === 'dev' ? 'dev' : 'master') + '/';
					return $sce.trustAsResourceUrl(src);
				};
			}
		}
	}]);
})();
/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Initialize widget's requirement (once)
	 */
	Zemit.app.onReady(['$modal', '$i18n', function($modal, $i18n) {
		$modal.create('doc', {
			title: $i18n.get('core.components.doc.title'),
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
			templateUrl: 'core/components/doc/doc.html',
			link: function ($s, $e, attrs) {
				
				$s.getUrl = () => {
					var src = '//zemit.gitbooks.io/layout-engine/content' + (Zemit.version === 'dev' ? '/v/dev' : '') + '/';
					return $sce.trustAsResourceUrl(src);
				};
			}
		}
	}]);
})();
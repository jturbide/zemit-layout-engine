(function() {
	
	Zemit.app.run(['$modules', function($modules) {
		
		/**
		 * Bootstrap your modules here
		 */
		$modules.bootstrap([
			'easteregg',
			'example',
			'code',
			'partial',
			'segment'
		]);
	}]);
})();
(function() {
	
	Zemit.app.run(['$modules', function($modules) {
		
		/**
		 * Bootstrap your modules here
		 * 
		 * Please do not use variables to generate the array content otherwise
		 * the compiler won't be able to parse the list and generate the dist
		 * folder properly.
		 * 
		 * Make sure the format stays the following:
		 * 
		 * $modules.bootstrap([
		 *	'mymodule1',
		 *	'mymodule2',
		 *	'mymodule3'
		 * ])
		 */
		$modules.bootstrap([
			'easteregg',
			'example',
			'code',
			'partial',
			'segment',
			'google'
		]);
	}]);
})();
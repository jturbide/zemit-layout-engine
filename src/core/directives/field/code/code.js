/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Code field
	 */
	Zemit.app.directive('zmFieldCode', [function() {
		return {
			restrict: 'E',
			templateUrl: 'core/directives/field/code/code.html',
			scope: {
				ngModel: '=',
				mode: '='
			},
			link: function($s, $e, attrs) {
				
				let mode = 'htmlmixed';
				let value = '';
				
				switch($s.mode) {
					case 'js': mode = 'javascript'; break;
					case 'css': mode = 'css'; break;
					case 'html': mode = 'text/html'; break;
				}
				
				let editor = CodeMirror($e[0], {
					value: value,
					mode: mode,
					autoCloseTags: true,
    				lineNumbers: true,
    				indentWithTabs: true,
    				indentUnit: 4,
    				allowDropFileTypes: false
				});
				
				$s.ngModel = editor;
			}
		}
	}]);
})();
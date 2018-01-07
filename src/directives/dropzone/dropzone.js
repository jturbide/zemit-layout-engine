/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Dropzone directive
	 */
	Zemit.app.directive('zmDropzone', [function() {
		return {
			restrict: 'A',
			scope: {
				options: '=zmDropzone'
			},
			link: function ($s, $e, attrs) {
			    
		        interact($e[0]).dropzone({
					accept: $s.options.accept,
					overlap: 'pointer',
					ondropactivate: (event) => {
						$e.addClass('zm-drop-activated');
					},
					ondropdeactivate: (event) => {
						$e.removeClass('zm-drop-activated');
					},
					ondragenter: (event) => {
						$e.addClass('zm-drop-hover');
					},
					ondragleave: (event) => {
						$e.removeClass('zm-drop-hover');
					},
					ondropmove: $s.options.onDropMove,
					ondrop: (event) => {
					    $s.options.onDrop && $s.options.onDrop(event.interaction.draggedItem);
					    $e.removeClass('zm-drop-hover');
					}
			    });
			}
		};
	}]);
})();
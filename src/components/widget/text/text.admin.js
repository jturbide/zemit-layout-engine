/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Text widget settings
	 * 
	 * External documentation:
	 * http://w3c.github.io/selection-api/
	 * https://w3c.github.io/editing/contentEditable.html
	 */
	Zemit.widgets.init('text', {
		injectable: {
			section: 'content',
			title: 'Text',
			desc: 'Advanced WYSIWYG editor',
			icon: 'font',
		},
		defaultValues: {
			text: '<p>Lorem ipsum dolor amet</p>'
		},
		settings: {
			title: 'Text',
			controller: function($widgets, $di, attrs) {
				
				$widgets.forEach(function(widget) {
					widget.getScope().editor.execAction(command, opts);
				});
			}
		},
		controller: function($s, $e, $di, attrs) {
			
			var $editorElement = $e.children('.zm-text-content');
			var namespace = 'zmWidgetText';
			
			// Copy content in another scope so MediumEditor can alter
			// its content and update the widget's scope without resetting
			// itself every time.
			$s.text = $s.widget.text;
			
			var editor = new Quill($editorElement[0], {
				theme: 'snow',
				placeholder: 'Type your content here...',
				modules: {
					toolbar: false
				}
			});


			// editor.subscribe('editableInput', function (event, editable) {
			// 	//$s.$apply(function() {
			// 		$s.widget.content.value = editor.getContent();
			// 	//});
			// });
			// editor.subscribe('blur', function (event, editable) {
				
			// 	if(event.target.id.startsWith('medium-editor')) {
			// 		return;
			// 	}
				
			// 	unbindEvents();
			// 	bindEvents();
			// 	$s.widget.bindEvents();
				
			// 	$s.$element.removeClass('zm-widget-focus');
				
			// 	// Unselect all text
			// 	if (document.selection) {
			// 		document.selection.empty();
			// 	}
			// 	else if (window.getSelection) {
			// 		window.getSelection().removeAllRanges();
			// 	}
			// });
			
			var bindEvents = function() {
				
				// Double-clicking in this widget should select the text only
				// in this context. We thus stop the propagation of the
				// event so the widget doesn't get selected.
				$e.on('dblclick.' + namespace, function(event) {
					
					event.stopPropagation();
					
					$s.widget.unbindEvents(['click', 'draggable']);
					unbindEvents();
					
					$e.on('click.' + namespace, function(event) {
						event.stopPropagation();
					});
					$e.on('keydown.' + namespace, function(event) {
						event.stopPropagation();
					});
					$e.on('mousedown.' + namespace, function(event) {
						event.stopPropagation();
					});
					
					//$s.$element.addClass('zm-widget-focus');
					
					// Select all automatically
					editor.enable();
					editor.focus();
					$s.widget.select(false, false, true);
					$s.$apply();
				});
			};
			bindEvents();
			
			var unbindEvents = function() {
				$s.$element.off('.' + namespace);
			};
			
			$s.editor = editor;
		}
	});
})();
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
	Zemit.app.onReady(['$i18n', function($i18n) {
		Zemit.widgets.init('text', {
			injectable: {
				section: 'content',
				title: $i18n.get('core.components.widget.text.title'),
				desc: $i18n.get('core.components.widget.text.desc'),
				icon: 'font',
			},
			defaultValues: {
				text: '<p>Lorem ipsum dolor amet</p>'
			},
			defaultAction: function($s, widget) {
				$s.state.edit();
			},
			controller: function($s, $e, $di, attrs) {
				
				var $zm = $di.get('$zm');
				var $timeout = $di.get('$timeout');
				var $i18n = $di.get('$i18n');
				var $overlay = $di.get('$overlay');
				var $editorElement = $e.children('.zm-text-content');
				var namespace = 'zmWidgetText';
				
				// Copy content in another scope so MediumEditor can alter
				// its content and update the widget's scope without resetting
				// itself every time.
				$s.text = $s.widget.text;
				$s.$watch('widget.text', function(nv, ov) {
					if(nv !== ov) {
						$s.text = $s.widget.text;
					}
				});
				
				var overlay = new $overlay($s, {
					title: $i18n.get('core.components.widget.text.overlay.title'),
					templateUrl: 'core/components/widget/text/text.overlay.html',
					onShow: function($overlayElement) {
						
						// $s.selectAll = () => {
						// 	var contentEditable = $overlayElement.find('.zm-text-content-editor-text')[0];
						// 	contentEditable.innerHTML = $s.widget.text;
						// 	contentEditable.focus();
							
						// 	document.execCommand('selectAll', false, null);
						// };
						
						// $timeout($s.selectAll, 250);
					},
					onApply: function() {
						
						var text = overlay.$element.find('.zm-text-content-editor-text').html();
						$s.text = text;
						$s.widget.text = text;
					}
				});
				
				$s.state = {
					editing: false,
					edit: function() {
						
						this.editing = true;
						overlay.show();
					},
					apply: function() {
						
						var html = overlay.$e.find('.zm-text-content-editor-text').html();
						$s.text = html;
						$zm.action(function() {
							$s.widget.text = html;
						}, undefined, $s.widget);
						
						this.editing = false;
						overlay.close();
					},
					close: function() {
						
						this.editing = false;
						overlay.close();
					}
				};
			}
		});
	}]);
})();
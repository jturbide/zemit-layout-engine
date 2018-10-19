/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	Zemit.module('code', {
		group: 'widget',
		dependencies: ['widget'],
	}, ['$i18n', '$modal', function($i18n, $modal) {
		return {
			directives: {
				zmWidgetCodeEdit: {
					restrict: 'E',
					replace: true,
					templateUrl: 'modules/code/code.edit.html',
					link: function ($s, $e, attrs) {
						
						var editors = {};
						var tabs = {
							current: 'html',
							items: [
								{ key: 'html', title: 'HTML', editor: true },
								{ key: 'css', title: 'CSS', editor: true },
								{ key: 'js', title: 'JS', editor: true },
								{ key: 'preview', title: 'Preview' }
							],
							set: function (tab) {
								
								this.current = tab;
								this.items.forEach(item => {
									
									if(item.editor) {
										let editor = editors[item.key];
										$s[item.key] = editor.getValue();
									}
								});
							}
						};
						
						tabs.items.forEach(tab => {
							if(tab.editor) {
								editors[tab.key] = {};
							}
						});
						
						$s.tabs = tabs;
						$s.editors = editors;
						$s.html = '';
						$s.css = '';
						$s.js = '';
						
						$s.$emit('modalBodyReady', $s);
					}
				}
			},
			onInit: () => {
				
				Zemit.widgets.register('modules/code');
				
				Zemit.widgets.init('code', {
					injectable: {
						section: 'customizable',
						title: $i18n.get('widget.code.title'),
						desc: $i18n.get('widget.code.desc'),
						icon: 'code',
					},
					defaultAction: function($s, widget) {
						$s.edit();
					},
					defaultValues: {
						css: null,
						js: null,
						html: null
					},
					controller: function($s, $e, $di, attrs) {
						
						$s.edit = () => {
							
							$modal.dialog('widgets_code_edit', {
								title: 'Code edition',
								directive: 'zm-widget-code-edit',
								buttons: {
									cancel: {
										label: $i18n.get('modules.code.editModal.btnCancel'),
										callback: (modal) => {
											console.log(modal);
										}
									},
									save: {
										label: $i18n.get('modules.code.editModal.btnSave'),
										callback: (modal) => {
											console.log(modal);
										}
									}
								}
							});
						};
					}
				});
			}
		};
	}]);
})();
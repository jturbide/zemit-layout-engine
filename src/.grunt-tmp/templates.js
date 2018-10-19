angular.module('zemit').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('core/directives/accordion/accordion.html',
    "<div class=\"zm-accordion-group zm-flex-minimal\">\n" +
    "	<div class=\"zm-accordion-header\" ng-click=\"toggle()\">\n" +
    "		<div ng-transclude=\"header\"></div>\n" +
    "	</div>\n" +
    "	<div class=\"zm-accordion-content\" zm-slide-y=\"model\">\n" +
    "		<div ng-transclude=\"content\"></div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/btn/btn.html',
    "<div class=\"zm-btn\" role=\"button\" tabindex=\"0\">\n" +
    "    <span class=\"zm-flex-container zm-flex-align-center zm-h100 zm-flex-nowrap\" ng-transclude></span>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/dismissable/dismissable.html',
    "<div zm-slide-y=\"isVisible\" ng-if=\"$modules.isActivated('help') && (!list || getEffectiveList().length > 0)\">\n" +
    "	\n" +
    "	<!-- SINGLE -->\n" +
    "	<div ng-if=\"!list\" class=\"zm-dismissable zm-bg-{{ type }}\">\n" +
    "		<div class=\"zm-flex-container zm-flex-nowrap zm-flex-align-center\">\n" +
    "			<div class=\"zm-flex-minimal zm-dismissable-icon\">\n" +
    "				<i class=\"fa fa-info-circle\" ng-if=\"type === 'info'\"></i>\n" +
    "				<i class=\"fa fa-exclamation-triangle\" ng-if=\"type === 'warning'\"></i>\n" +
    "			</div>\n" +
    "			<div class=\"zm-dismissable-content zm-selectable\">\n" +
    "				<span ng-transclude></span>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	\n" +
    "	<!-- LIST -->\n" +
    "	<div ng-if=\"list\" class=\"zm-dismissable zm-bg-{{ effectiveList[index].type }}\">\n" +
    "		<div class=\"zm-flex-container zm-flex-nowrap zm-flex-align-center\">\n" +
    "			<div class=\"zm-flex-minimal zm-dismissable-icon\">\n" +
    "				<i class=\"fa fa-info-circle\" ng-if=\"effectiveList[index].type === 'info'\"></i>\n" +
    "				<i class=\"fa fa-exclamation-triangle\" ng-if=\"effectiveList[index].type === 'warning'\"></i>\n" +
    "			</div>\n" +
    "			<div class=\"zm-dismissable-content zm-selectable\">\n" +
    "				<span ng-bind-html=\"getLabel(effectiveList[index]) | trustHtml\"></span>\n" +
    "			</div>\n" +
    "			<div ng-if=\"effectiveList.length > 1\" ng-click=\"next()\" class=\"zm-flex-minimal zm-dismissable-next\" zm-zoomable>\n" +
    "				<i class=\"fa fa-chevron-right\"></i>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/field/code/code.html',
    "<div class=\"zm-field-code\"></div>"
  );


  $templateCache.put('core/directives/field/default/default.html',
    "<div class=\"zm-field\" ng-transclude>\n" +
    "	\n" +
    "</div>"
  );


  $templateCache.put('core/directives/field/input/input.html',
    "<div class=\"zm-field zm-field-input zm-field-{{ ::attrs.type }}\" ng-class=\"{'zm-field-has-icon': attrs.icon}\">\n" +
    "	<i class=\"zm-field-icon fa fa-{{ ::attrs.icon }}\" ng-if=\"::attrs.icon\"></i>\n" +
    "	<input type=\"text\" />\n" +
    "</div>"
  );


  $templateCache.put('core/directives/field/switch/switch.html',
    "<zm-field class=\"zm-field zm-field-switch zm-flex-container zm-flex-gap zm-flex-align-center\" ng-click=\"toggle($event)\">\n" +
    "	<div class=\"zm-field-switch-toggle zm-flex-minimal\">\n" +
    "		<i class=\"fa\" ng-class=\"{'fa-toggle-on': ngModel, 'fa-toggle-off': !ngModel}\"></i>\n" +
    "	</div>\n" +
    "	<div ng-if=\"title\" class=\"zm-field-switch-title\">\n" +
    "		{{ ::title }}\n" +
    "	</div>\n" +
    "</zm-field>"
  );


  $templateCache.put('core/directives/field/treeview/treeview.after.html',
    ""
  );


  $templateCache.put('core/directives/field/treeview/treeview.before.html',
    "<!-- EMPTY -->\n" +
    "<div class=\"zm-text-center zm-flex-container zm-flex-align-center\" ng-if=\"lvlList.length === 0\">\n" +
    "    <i class=\"fa fa-exclamation-circle fa-margin-right zm-flex-minimal\"></i>\n" +
    "    {{ ::(lvlOptions.emptyLabel || $root.t('core.directives.field.treeview.listEmpty')) }}\n" +
    "</div>"
  );


  $templateCache.put('core/directives/field/treeview/treeview.default.html',
    "<div class=\"zm-treeview-group\" ng-class=\"{ 'zm-treeview-opened': settings.treeview[currentNode.key] }\" ng-init=\"currentNode = node; lvlSettings = { viewItems: settings.treeview[currentNode.key] || false }; parentOptions = options.levels[depth - 1]; lvlOptions = options.levels[depth];\">\n" +
    "	\n" +
    "	<!-- GROUP TITLE -->\n" +
    "	<div ng-click=\"toggle(lvlSettings, currentNode, $event)\"\n" +
    "		 ng-include=\"lvlOptions.toolbarTemplate || defaultLvlToolbar\"\n" +
    "		 class=\"zm-treeview-group-title zm-flex-container zm-flex-gap zm-flex-align-center\"\n" +
    "		 ng-class=\"{ 'zm-shadow-down': settings.treeview[currentNode.key] }\"></div>\n" +
    "	\n" +
    "	<div class=\"zm-field-treeview-sub-level\" zm-slide-y=\"settings.treeview[currentNode.key]\">\n" +
    "		<div class=\"zm-field-treeview-sub-level-inner zm-p-3 zm-pr-0\">\n" +
    "			\n" +
    "			<!-- NO KEY PROPERTY WARNING -->\n" +
    "			<zm-dismissable class=\"zm-mr-3\" type=\"warning\" ng-if=\"!currentNode.key\">\n" +
    "				{{ ::$root.t('core.field.treeview.noKey') }}\n" +
    "			</zm-dismissable>\n" +
    "			\n" +
    "			<!-- NO CHILD -->\n" +
    "			<div class=\"zm-mr-3\" ng-if=\"depth < options.levels.length - 1 && node.childs.length === 0\">\n" +
    "				\n" +
    "				<!-- EMPTY, CAN'T ADD -->\n" +
    "				<div ng-if=\"!lvlOptions.canAdd\">\n" +
    "					{{ ::(lvlOptions.emptyLabel || $root.t('core.field.treeview.emptyLabel')) }}\n" +
    "				</div>\n" +
    "				\n" +
    "				<!-- EMPTY, CAN ADD -->\n" +
    "				<zm-btn ng-if=\"lvlOptions.canAdd\" class=\"zm-btn-default\" ng-click=\"lvlOptions.onAdd(node.data, parent.data, addCallback(node.childs, $index), depth)\">\n" +
    "					<i class=\"fa fa-plus fa-margin-right\"></i>\n" +
    "					{{ ::(lvlOptions.addLabel || $root.t('core.field.treeview.addChild')) }}\n" +
    "				</zm-btn>\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- NO CHILD (FILTERED) -->\n" +
    "			<div class=\"zm-mr-3\" ng-if=\"depth < options.levels.length - 1 && filter(node.childs).length === 0 && node.childs.length > 0\">\n" +
    "				{{ ::$root.t('core.field.treeview.noChildFiltered') }}\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- HAS KEY PROPERTY -->\n" +
    "			<div ng-if=\"currentNode.key\">\n" +
    "				\n" +
    "				<!-- BEFORE -->\n" +
    "				<div ng-include=\"lvlOptions.beforeTemplate || defaultLvlBefore\"></div>\n" +
    "		\n" +
    "				<!-- LIST OF ELEMENTS -->\n" +
    "				<ol ng-if=\"depth < options.levels.length\">\n" +
    "					<li ng-class=\"{ first: $index === 0, last: filteredLvlList.length === ($index + 1) }\"\n" +
    "						class=\"zm-treeview-list-item zm-treeview-list-item-depth{{ depth }}\"\n" +
    "						ng-repeat=\"node in filteredLvlList = filter(node.childs) track by $index\"\n" +
    "						ng-init=\"depth = depth + 1; parentList = currentNode.childs; parent = currentNode;\"\n" +
    "						ng-include=\"lvlOptions.itemTemplate || defaultTemplate\"></li>\n" +
    "				</ol>\n" +
    "				\n" +
    "				<!-- AFTER -->\n" +
    "				<div ng-include=\"lvlOptions.afterTemplate || defaultLvlAfter\"></div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/field/treeview/treeview.html',
    "<div class=\"zm-field zm-field-treeview zm-treeview-container\" ng-if=\"visible\">\n" +
    "	<div ng-class=\"{ first: $index === 0, last: filteredChilds.length === ($index + 1) }\"\n" +
    "		 class=\"zm-treeview-list-item zm-treeview-list-item-depth0\"\n" +
    "		 ng-init=\"container = node; filteredChilds = filter(node.childs)\"\n" +
    "		 ng-repeat=\"node in filteredLvlList = filter(list) track by $index\"\n" +
    "		 ng-include=\"lvlOptions.itemTemplate || defaultTemplate\"></div>\n" +
    "		 \n" +
    "	<div class=\"zm-p-2 zm-text-center\" ng-if=\"filteredLvlList.length === 0\">\n" +
    "		{{ ::$root.t('core.field.treeview.noItemFound') }}\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/field/treeview/treeview.options.html',
    "<div ng-click=\"$event.stopPropagation()\" class=\"zm-flex-container zm-flex-gap-x zm-flex-nowrap\">\n" +
    "	\n" +
    "	<!-- MORE OPTIONS -->\n" +
    "	<zm-tabs anchor=\"top-right\">\n" +
    "		<items>\n" +
    "			\n" +
    "			<!-- EDIT -->\n" +
    "			<li ng-click=\"lvlOptions.onEdit(node.data, parent.data, editCallback(node), depth)\" class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\">\n" +
    "				<i class=\"fa fa-pencil zm-flex-minimal\"></i>\n" +
    "				<span>\n" +
    "					{{ ::$root.t('core.directives.field.treeview.btnEdit') }}\n" +
    "				</span>\n" +
    "			</li>\n" +
    "			\n" +
    "			<!-- ADD -->\n" +
    "			<li ng-if=\"lvlOptions.canAdd\" ng-click=\"lvlOptions.onAdd(node.data, parent.data, addCallback(node.childs, $index), depth)\" class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\">\n" +
    "				<i class=\"fa fa-plus zm-flex-minimal\"></i>\n" +
    "				<span>\n" +
    "					{{ ::$root.t('core.directives.field.treeview.btnAdd') }}\n" +
    "				</span>\n" +
    "			</li>\n" +
    "			\n" +
    "			<!-- OPEN -->\n" +
    "			<li ng-if=\"lvlOptions.canOpen\" ng-click=\"lvlOptions.onOpen(node.data, parent.data, depth)\" class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\">\n" +
    "				<i class=\"fa fa-folder-open-o zm-flex-minimal\"></i>\n" +
    "				<span>\n" +
    "					{{ ::$root.t('core.directives.field.treeview.btnOpen') }}\n" +
    "				</span>\n" +
    "			</li>\n" +
    "			\n" +
    "			<!-- REMOVE -->\n" +
    "			<li ng-click=\"lvlOptions.onRemove(node.data, parent.data, removeCallback(parentList, $index), depth)\" class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\">\n" +
    "				<i class=\"fa fa-trash-o zm-flex-minimal\"></i>\n" +
    "				<span>\n" +
    "					{{ ::$root.t('core.directives.field.treeview.btnRemove') }}\n" +
    "				</span>\n" +
    "			</li>\n" +
    "		</items>\n" +
    "	</zm-tabs>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/field/treeview/treeview.toolbar.html',
    "<!-- CHEVRON -->\n" +
    "<i ng-if=\"lvlOptions.canAdd\" class=\"fa zm-pull-right zm-flex-minimal\" ng-class=\"{\n" +
    "	'fa-chevron-down': lvlSettings.viewItems,\n" +
    "	'fa-chevron-right': !lvlSettings.viewItems\n" +
    "}\"></i>\n" +
    "\n" +
    "<!-- TITLE -->\n" +
    "<span>\n" +
    "	{{ node.title }}\n" +
    "</span>\n" +
    "\n" +
    "<!-- TOTAL NODES -->\n" +
    "<div ng-if=\"depth < options.levels.length\" class=\"zm-badge\" ng-class=\"{ 'zm-empty': filter(node.childs).length === 0 }\">\n" +
    "	{{ filter(node.childs).length }}\n" +
    "</div>\n" +
    "\n" +
    "<!-- OPTIONS -->\n" +
    "<div ng-if=\"!lvlOptions.canAdd\" ng-include=\"defaultLvlOptions\"></div>"
  );


  $templateCache.put('core/directives/loading/loading.html',
    "<div class=\"zm-loading\" ng-class=\"{ 'zm-invisible': !visible }\">\n" +
    "	<div class=\"zm-loading-bar\"></div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/modal/modal.html',
    "<div tabindex=\"0\" class=\"zm-modal zoom-container\" style=\"z-index: {{ modal.zIndex }}\" ng-class=\"{'zm-visible': modal.visible, 'zm-modal-hidden': modal.hidden, 'zm-modal-is-top': modal.zIndex === $modal.zIndex }\">\n" +
    "	<div ng-mousedown=\"modal.updateZIndex()\" class=\"zm-modal-inner zoom-item zm-flex-container-column\">\n" +
    "		<div class=\"zm-modal-header zm-gradient-primary zm-clearfix zm-flex-minimal\">\n" +
    "			\n" +
    "			<!-- HEADER -->\n" +
    "			<div class=\"zm-modal-header-inner\" ng-transclude=\"header\"></div>\n" +
    "			\n" +
    "			<!-- CLOSE BUTTON -->\n" +
    "			<div class=\"zm-modal-close-btn\" zm-clickable zm-zoomable ng-click=\"modal.close()\">\n" +
    "				<i class=\"fa fa-remove\"></i>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"zm-modal-body\">\n" +
    "			\n" +
    "			<!-- BODY -->\n" +
    "			<form ng-submit=\"submit()\" autocomplete=\"on\">\n" +
    "				<div class=\"zm-modal-body-inner\" ng-transclude=\"body\"></div>\n" +
    "				<input type=\"submit\" value=\"test\" class=\"zm-hidden\" />\n" +
    "			</form>\n" +
    "		</div>\n" +
    "		<div class=\"zm-modal-footer zm-flex-minimal\">\n" +
    "			\n" +
    "			<!-- FOOTER -->\n" +
    "			<div class=\"zm-modal-footer-inner zm-flex-container zm-clearfix\">\n" +
    "				\n" +
    "				<!-- DEFAULT CLOSE BUTTON -->\n" +
    "				<zm-btn ng-if=\"!modal.params.buttons\" class=\"zm-pull-right zm-btn-default\" type=\"button\" ng-click=\"modal.close()\">\n" +
    "					{{ ::t('core.directives.modal.btnClose') }}\n" +
    "				</zm-btn>\n" +
    "				\n" +
    "				<!-- LIST OF BUTTONS -->\n" +
    "				<zm-btn ng-class=\"{\n" +
    "					'zm-btn-default': button.default,\n" +
    "					'zm-btn-primary': button.primary,\n" +
    "					'zm-btn-warning': button.warning,\n" +
    "					'zm-btn-danger': button.danger\n" +
    "				}\" ng-disabled=\"!modal.visible || button.disabled($event, modal)\" ng-click=\"(button.callback ? button.callback($event, modal) : modal.close())\" ng-repeat=\"button in modal.params.buttons\">\n" +
    "					<i ng-if=\"button.icon\" class=\"fa {{ ::button.icon }}\"></i>\n" +
    "					{{ ::button.label }}\n" +
    "				</zm-btn>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/overlay/overlay.html',
    "<div class=\"zm-overlay zoom-container\" ng-class=\"{'zm-visible': overlay.visible}\">\n" +
    "	<div class=\"zm-overlay-inner zoom-item zm-flex-container-column\">\n" +
    "		\n" +
    "		<!-- HEADING -->\n" +
    "		<div class=\"zm-overlay-heading zm-flex-minimal\" ng-if=\"overlay.params.title\">\n" +
    "			{{ overlay.params.title }}\n" +
    "		</div>\n" +
    "		\n" +
    "		<div ng-include=\"templateUrl\" class=\"zm-overlay-template\"></div>\n" +
    "		\n" +
    "		<!-- QUICK ACTIONS -->\n" +
    "		<div class=\"zm-overlay-actions zm-flex-minimal\">\n" +
    "			<div class=\"zm-flex-container zm-flex-gap\">\n" +
    "				\n" +
    "				<!-- CANCEL -->\n" +
    "				<zm-btn style=\"flex: 1\" ng-click=\"overlay.cancel()\">\n" +
    "					Cancel\n" +
    "				</zm-btn>\n" +
    "				\n" +
    "				<!-- APPLY -->\n" +
    "				<zm-btn style=\"flex: 3\" ng-click=\"overlay.apply()\">\n" +
    "					<i class=\"fa fa-check fa-margin-right\"></i>\n" +
    "					Apply\n" +
    "				</zm-btn>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/sidebar/modules/modules.html',
    "<div class=\"zm-sidebar-modules zm-flex-container-column zm-h100\">\n" +
    "	\n" +
    "	<div class=\"zm-flex-minimal\">\n" +
    "		\n" +
    "		<!-- NOTICE -->\n" +
    "		<zm-dismissable class=\"zm-flex-minimal\" type=\"info\" key=\"zm-sidebar-modules-intro\">\n" +
    "			{{ ::t('core.components.sidebar.modules.noticeIntro') }}\n" +
    "		</zm-dismissable>\n" +
    "		\n" +
    "		<!-- FILTER -->\n" +
    "		<div class=\"zm-flex-minimal zm-p-2\">\n" +
    "			<zm-field-input type=\"text\" icon=\"search\" placeholder=\"{{ ::t('core.components.sidebar.modules.filterPlaceholder') }}\" ng-model=\"filters.query\" ng-disabled=\"Object.keys(groups).length === 0\" autofocus=\"on\" />\n" +
    "			\n" +
    "			<!-- IF NO modules FOUND -->\n" +
    "			<p ng-if=\"Object.keys(groups).length > 0 && filteredGroups.length === 0\" style=\"text-align: center\">\n" +
    "				{{ ::t('core.components.sidebar.modules.noModuleFound') }}\n" +
    "			</p>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div zm-scrollable=\"{ direction: 'y', key: 'modules' }\" class=\"zm-flex-container-column\">\n" +
    "		\n" +
    "		<!-- EMPTY -->\n" +
    "		<div class=\"zm-p-2 zm-text-center zm-flex-container zm-flex-align-center\" ng-if=\"Object.keys(groups).length === 0\">\n" +
    "			<div>\n" +
    "				<i class=\"fa fa-exclamation-circle\" style=\"font-size: 2rem\"></i>\n" +
    "				<br />{{ ::t('core.components.sidebar.modules.empty') }}\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		\n" +
    "		<!-- MODULES GROUPS -->\n" +
    "		<zm-accordion ng-model=\"tabs[group.name].visible\" ng-repeat=\"group in filteredGroups | orderBy: 'title'\">\n" +
    "			<header class=\"zm-flex-container zm-flex-gap zm-flex-align-center\">\n" +
    "				<span class=\"zm-sidebar-title-text\">\n" +
    "					{{ ::group.title }}\n" +
    "				</span>\n" +
    "				\n" +
    "				<!-- TOTAL NODES -->\n" +
    "				<div class=\"zm-badge zm-flex-minimal\">\n" +
    "					{{ group.modules.length }}\n" +
    "				</div>\n" +
    "				\n" +
    "				<i class=\"fa zm-pull-right zm-flex-minimal\" ng-class=\"{'fa-chevron-down': tabs[group.name].visible, 'fa-chevron-right': !tabs[group.name].visible}\"></i>\n" +
    "			</header>\n" +
    "			<content>\n" +
    "				\n" +
    "				<!-- LIST OF ITEMS (REPEAT) -->\n" +
    "				<div class=\"zm-sidebar-modules-item zm-modules-item zm-p-3\" ng-class=\"{ 'zm-has-error': !$modules.dependenciesAllActivated(module) }\" ng-repeat=\"module in group.modules | orderBy: 'title'\" ng-class=\"{ activated: settings[module.name].activated }\">\n" +
    "					<div class=\"zm-flex-container\">\n" +
    "						<div class=\"zm-flex-minimal zm-pr-3\">\n" +
    "							<zm-field-switch ng-change=\"toggle(module, settings[module.name].activated)\" ng-model=\"settings[module.name].activated\"></zm-field-switch>\n" +
    "						</div>\n" +
    "						<div class=\"zm-sidebar-module-item-content\">\n" +
    "							<div class=\"zm-sidebar-modules-item-title\">\n" +
    "								<strong>\n" +
    "									{{ ::module.title }}\n" +
    "								</strong>\n" +
    "							</div>\n" +
    "							<div class=\"zm-sidebar-modules-item-desc\">\n" +
    "								{{ ::module.desc }}\n" +
    "							</div>\n" +
    "							<small class=\"zm-sidebar-modules-item-dependencies zm-mt-2\" ng-if=\"module.dependencies.length > 0\">\n" +
    "								<em>{{ ::t('core.components.sidebar.modules.dependencies') }}</em>\n" +
    "								<em class=\"zm-sidebar-modules-item-dependency-item\" ng-repeat=\"dependency in module.dependencies | orderBy: 'dependency'\">\n" +
    "									<span>{{ ::dependency }}</span>\n" +
    "									<span ng-if=\"$index < module.dependencies.length - 1\">, </span>\n" +
    "								</em>\n" +
    "							</small>\n" +
    "						</div>\n" +
    "						<div class=\"zm-flex-minimal zm-flex-align-self-center zm-pl-3\">\n" +
    "							<img ng-src=\"{{ module.thumbnail }}\" style=\"max-height: 3rem\" />\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</content>\n" +
    "		</zm-accordion>\n" +
    "	</div>\n" +
    "	<div class=\"zm-flex-minimal\">\n" +
    "		\n" +
    "		<!-- APPLY -->\n" +
    "		<div class=\"zm-p-2 zm-flex-minimal\">\n" +
    "			<zm-btn ng-disabled=\"!hasDifferences()\" class=\"zm-w100 zm-btn-warning\" ng-click=\"apply()\">\n" +
    "				<i class=\"fa fa-check fa-margin-right\"></i>\n" +
    "				{{ ::t('core.components.sidebar.modules.applyBtn') }}\n" +
    "			</zm-btn>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/sidebar/sidebar.html',
    "<div class=\"zm-sidebar\" ng-class=\"{'zm-open': tabs.showContent && !tabs.hidden }\">\n" +
    "	<div class=\"zm-sidebar-inner zm-clearfix zm-flex-container\">\n" +
    "		<div zm-if=\"tabs.showContent\" class=\"zm-sidebar-tab zm-flex-container\">\n" +
    "			\n" +
    "			<!-- DYNAMIC TABS CONTENT -->\n" +
    "			<div class=\"zm-flex-container\" ng-repeat=\"tab in $sidebar.tabs | orderBy: 'priority'\" ng-if=\"settings.sidebar.tabs[tab.key].visible && tab.isVisible()\" class=\"zm-sidebar-group zm-sidebar-{{ tab.key }}\" zm-if-timeout=\"tabs.showContent ? 0 : 250\" zm-if-keep>\n" +
    "				<zm-directive name=\"tab.directive\"></zm-directive>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"zm-sidebar-tabs zm-flex-minimal zm-flex-container-column\">\n" +
    "			<div class=\"zm-sidebar-tabs-inner zm-flex-container-column\">\n" +
    "				<ul class=\"zm-tabs zm-tabs-vertical-right zm-flex-minimal\">\n" +
    "					\n" +
    "					<!-- DYNAMIC TABS -->\n" +
    "					<li ng-repeat=\"tab in $sidebar.tabs | orderBy: 'priority'\" ng-if=\"tab.isVisible()\" ng-disabled=\"!tab.canAccess()\" ng-class=\"{'active': settings.sidebar.tabs[tab.key].visible}\" ng-click=\"tabs.toggle(tab.key)\" class=\"zm-tab-item zm-tab-item-{{ ::tab.key }} zm-transition-all\">\n" +
    "						{{ ::tab.title }}\n" +
    "					</li>\n" +
    "				</ul>\n" +
    "				\n" +
    "				<!-- DYNAMIC ICONS (TOP) -->\n" +
    "				<a ng-repeat=\"icon in $sidebar.icons | filter: { position: 'top' } | orderBy: 'priority'\" ng-if=\"icon.isVisible()\" ng-disabled=\"!icon.canAccess()\" zm-tooltip=\"{{ ::icon.tooltip }}\" zm-tooltip-options=\"tooltip.options\" class=\"zm-sidebar-icon zm-sidebar-icon-top zm-flex-minimal zm-sidebar-{{ icon.key }} zm-transition-color\" ng-click=\"icon.events.click($event, this)\" ng-class=\"{ active: settings[icon.key].activated }\">\n" +
    "					<i class=\"fa fa-{{ icon.icon }}\"></i>\n" +
    "				</a>\n" +
    "				\n" +
    "				<div></div>\n" +
    "				\n" +
    "				<!-- DYNAMIC ICONS (BOTTOM) -->\n" +
    "				<a ng-repeat=\"icon in $sidebar.icons | filter: { position: 'bottom' } | orderBy: 'priority'\" ng-if=\"icon.isVisible()\" ng-disabled=\"!icon.canAccess()\" zm-tooltip=\"{{ ::icon.tooltip }}\" zm-tooltip-options=\"tooltip.options\" class=\"zm-sidebar-icon zm-sidebar-icon-bottom zm-sidebar-{{ icon.key }} {{ ::icon.className }} zm-flex-minimal zm-transition-opacity\" ng-attr-href=\"{{ ::icon.href }}\" ng-attr-target=\"{{ ::icon.target }}\">\n" +
    "					<img ng-if=\"icon.src\" ng-src=\"{{ ::icon.src }}\" />\n" +
    "				</a>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/tabs/tabs.html',
    "<div class=\"zm-tabs zm-tabs-style-{{ style }}\">\n" +
    "	<zm-btn ng-if=\"style === 'button'\" class=\"zm-tabs-handler zm-show-mobile\" ng-class=\"{active: tabs.visible}\" ng-disabled=\"ngDisabled\" ng-click=\"tabs.toggle();\">\n" +
    "		<div class=\"zm-tabs-toggle zm-h100\" ng-transclude=\"toggle\">\n" +
    "			<toggle>\n" +
    "				<i class=\"fa fa-bars\"></i>\n" +
    "			</toggle>\n" +
    "		</div>\n" +
    "	</zm-btn>\n" +
    "	<span ng-if=\"style === 'flat'\" class=\"zm-tabs-handler zm-show-mobile\" ng-class=\"{active: tabs.visible}\" ng-disabled=\"ngDisabled\" ng-click=\"tabs.toggle();\">\n" +
    "		<div class=\"zm-tabs-toggle zm-h100\" ng-transclude=\"toggle\">\n" +
    "			<toggle>\n" +
    "				<i class=\"fa fa-bars\"></i>\n" +
    "			</toggle>\n" +
    "		</div>\n" +
    "	</span>\n" +
    "	<div zm-slide-y=\"tabs.visible\" class=\"zm-tabs-list\">\n" +
    "		<ul class=\"zm-shadow-down\" ng-transclude=\"items\" ng-click=\"tabs.clickInside()\">\n" +
    "			<!-- TRANSCLUDE HERE -->\n" +
    "		</ul>\n" +
    "	</div>\n" +
    "</div>\n"
  );


  $templateCache.put('core/directives/toolbar/toolbar.backup.html',
    "<div class=\"zm-toolbar\">\n" +
    "	<div class=\"zm-toolbar-inner zm-clearfix\">\n" +
    "		\n" +
    "		<!-- LEFT -->\n" +
    "		<div class=\"zm-toolbar-section-left\">\n" +
    "			<div class=\"zm-toolbar-item\" ng-repeat=\"item in $toolbar.left | orderBy: 'priority'\">\n" +
    "				\n" +
    "				<!-- DIRECTIVE -->\n" +
    "				<zm-directive ng-if=\"item.type === 'directive'\" name=\"item.directive\"></zm-directive>\n" +
    "				\n" +
    "				<!-- BUTTON -->\n" +
    "				<zm-btn ng-if=\"item.type === 'button' && item.isVisible()\" ng-disabled=\"!item.canAccess()\" zm-tooltip=\"{{ ::item.tooltip }}\" class=\"zm-toolbar-item-{{ ::item.name }}\" ng-click=\"item.events.click($event, this)\">\n" +
    "					<i ng-if=\"item.icon\" class=\"fa fa-{{ ::item.icon }}\" ng-class=\"{ 'fa-margin-right': item.title }\"></i>\n" +
    "					<span ng-if=\"item.title\">{{ ::item.title }}</span>\n" +
    "				</zm-btn>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		\n" +
    "		<!-- ACTIONS -->\n" +
    "		<div class=\"zm-toolbar-actions zm-flex-container zm-flex-align-center zm-toolbar-actions-workspace\">\n" +
    "			\n" +
    "			<div ng-if=\"breadcrumbs.length > 0 && $device.isLargeEnough()\" class=\"zm-btn-sep zm-hide-mobile\" style=\"margin-left: 0; margin-right: 1rem;\"></div>\n" +
    "			\n" +
    "			<!-- BREADCRUMBS -->\n" +
    "			<div ng-if=\"breadcrumbs.length > 0 && $device.isLargeEnough()\" class=\"zm-breadcrumbs zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap zm-flex-minimal\" ng-class=\"{ 'zm-mr-3': $profile.isSignedIn === false }\">\n" +
    "				\n" +
    "				<i class=\"fa fa-cubes fa-margin-right zm-flex-minimal\"></i>\n" +
    "				\n" +
    "				<div class=\"zm-breadcrumb zm-flex-container zm-flex-gap-x zm-flex-nowrap zm-flex-align-center\"\n" +
    "					 ng-repeat=\"breadcrumb in breadcrumbs\"\n" +
    "					 ng-class=\"{ first: $index === 0, last: $index === breadcrumbs.length - 1 }\">\n" +
    "					<span ng-if=\"$index < breadcrumbs.length - 1\">\n" +
    "						{{ breadcrumb.label }}\n" +
    "					</span>\n" +
    "					<zm-tabs ng-if=\"$index === breadcrumbs.length - 1\" anchor=\"top-left\" style=\"flat\">\n" +
    "						<toggle zm-tooltip=\"{{ ::t('core.components.toolbar.tooltip.segment') }}\">\n" +
    "							\n" +
    "							{{ breadcrumb.label }}\n" +
    "							\n" +
    "							<i style=\"font-size: 0.5rem; line-height: 1rem;\" class=\"fa fa-chevron-down\"></i>\n" +
    "						</toggle>\n" +
    "						<items>\n" +
    "							\n" +
    "							<!-- CLOSE -->\n" +
    "							<li class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\" ng-click=\"closeSegment()\">\n" +
    "								<i class=\"fa fa-window-close zm-flex-minimal\"></i>\n" +
    "								<span>\n" +
    "									{{ ::t('core.components.toolbar.closeSegment') }}\n" +
    "								</span>\n" +
    "							</li>\n" +
    "						</items>\n" +
    "					</zm-tabs>\n" +
    "					<i ng-if=\"$index < breadcrumbs.length - 1\" class=\"fa fa-angle-right zm-flex-minimal\"></i>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- LOADING/SAVING -->\n" +
    "			<zm-badge zm-if=\"$profile.isLoading || $profile.hasLoaded || $profile.isSaving || $profile.hasSaved\"\n" +
    "					  class=\"zm-ml-3 zm-transition-opacity zm-transition-background\"\n" +
    "					  ng-class=\"{ 'zm-bg-success': ($profile.hasLoaded || $profile.hasSaved) }\"\n" +
    "					  style=\"flex-basis: auto;\">\n" +
    "				\n" +
    "				<span ng-if=\"$profile.isLoading\">{{ ::t('core.components.toolbar.dataIsLoading') }}</span>\n" +
    "				<span ng-if=\"$profile.hasLoaded\">{{ ::t('core.components.toolbar.dataHasLoaded') }}</span>\n" +
    "				<span ng-if=\"$profile.isSaving\">{{ ::t('core.components.toolbar.dataIsSaving') }}</span>\n" +
    "				<span ng-if=\"$profile.hasSaved\">\n" +
    "					<i class=\"fa fa-thumbs-o-up fa-margin-right\"></i>\n" +
    "					{{ ::t('core.components.toolbar.dataHasSaved') }}\n" +
    "				</span>\n" +
    "			</zm-badge>\n" +
    "			\n" +
    "			<!-- NOT CONNECTED, DATA SAVED IN BROWSER -->\n" +
    "			<div ng-if=\"$profile.isSignedIn === false\" class=\"zm-toolbar-not-connected-data zm-flex-container zm-flex-gap-x zm-flex-align-center\">\n" +
    "				<i class=\"fa fa-exclamation-circle zm-flex-minimal zm-text-primary\"></i>\n" +
    "				<span>{{ ::t('core.components.toolbar.notConnectedDataBrowser') }}</span>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		\n" +
    "		<!-- GENERAL -->\n" +
    "		<div class=\"zm-toolbar-actions zm-toolbar-actions-general\">\n" +
    "			\n" +
    "			<!-- ACCOUNT -->\n" +
    "			<span ng-if=\"$profile.hasProviders !== false\" class=\"zm-toolbar-profile-container zm-toolbar-items-container zm-flex-align-center zm-hide-mobile zm-flex-nowrap\">\n" +
    "				\n" +
    "				<!-- LOADING -->\n" +
    "				<zm-loading ng-if=\"$profile.isLoaded === null\" visible=\"$profile.isLoaded === null\" style=\"width: 6rem\" />\n" +
    "			\n" +
    "				<!-- USER INFO -->\n" +
    "				<zm-tabs ng-if=\"$profile.isSignedIn === true\" anchor=\"top-left\" style=\"flat\">\n" +
    "					<toggle zm-tooltip=\"{{ ::t('core.components.toolbar.tooltip.myAccount') }}\">\n" +
    "						\n" +
    "						<img ng-src=\"{{ $profile.picture }}\" class=\"zm-profile-pic\" />\n" +
    "						{{ $profile.givenName }}\n" +
    "						\n" +
    "						<i style=\"font-size: 0.5rem; line-height: 1rem;\" class=\"fa fa-chevron-down\"></i>\n" +
    "					</toggle>\n" +
    "					<items>\n" +
    "						\n" +
    "						<!-- SIGN-OUT -->\n" +
    "						<li class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\" ng-click=\"$profile.signOut()\">\n" +
    "							<i class=\"fa fa-sign-out zm-flex-minimal\"></i>\n" +
    "							<span>\n" +
    "								{{ ::t('core.components.toolbar.signOut') }}\n" +
    "							</span>\n" +
    "						</li>\n" +
    "					</items>\n" +
    "				</zm-tabs>\n" +
    "				\n" +
    "				<!-- SIGN-IN -->\n" +
    "				<zm-btn ng-if=\"$profile.isSignedIn === false\" class=\"zm-btn-primary\" zm-tooltip=\"{{ ::t('core.components.toolbar.tooltip.signIn') }}\" ng-click=\"$profile.signIn()\">\n" +
    "					<i class=\"fa fa-sign-in fa-margin-right\"></i>\n" +
    "					{{ ::t('core.components.toolbar.signIn') }}\n" +
    "				</zm-btn>\n" +
    "				\n" +
    "				<!-- SEP -->\n" +
    "				<div class=\"zm-btn-sep zm-hide-mobile\"></div>\n" +
    "			</span>\n" +
    "			\n" +
    "			<!-- DYNAMIC BUTTONS: RIGHT -->\n" +
    "			<zm-btn ng-repeat=\"btn in $toolbar.right\" ng-if=\"btn.isVisible()\" ng-disabled=\"!btn.canAccess()\" zm-tooltip=\"{{ ::btn.tooltip }}\" class=\"zm-hide-mobile zm-toolbar-btn-{{ ::btn.name }}\" ng-click=\"btn.events.click($event, this)\">\n" +
    "				<i ng-if=\"btn.icon\" class=\"fa fa-{{ ::btn.icon }}\" ng-class=\"{ 'fa-margin-right': btn.title }\"></i>\n" +
    "				<span ng-if=\"btn.title\">{{ ::btn.title }}</span>\n" +
    "			</zm-btn>\n" +
    "			\n" +
    "			<!-- TABS: SETTINGS -->\n" +
    "			<zm-tabs ng-disabled=\"!$segment.isValid()\" anchor=\"top-right\">\n" +
    "				<toggle zm-tooltip=\"{{ ::t('core.components.toolbar.tooltip.settings') }}\">\n" +
    "					\n" +
    "					<i class=\"fa fa-gear\"></i>\n" +
    "					\n" +
    "					<i style=\"font-size: 0.5rem; line-height: 1rem;\" class=\"fa fa-chevron-down\"></i>\n" +
    "				</toggle>\n" +
    "				<items>\n" +
    "					\n" +
    "					<!-- IMPORT -->\n" +
    "					<li class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\" ng-disabled=\"!$segment.isValid() || !$segment.isValid()\" ng-click=\"$segment.import()\">\n" +
    "						<i class=\"fa fa-download zm-flex-minimal\"></i>\n" +
    "						<span>\n" +
    "							{{ ::t('core.components.toolbar.import') }}\n" +
    "						</span>\n" +
    "					</li>\n" +
    "					\n" +
    "					<!-- EXPORT -->\n" +
    "					<li class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\" ng-disabled=\"!$segment.isValid() || !$segment.isValid()\" ng-click=\"$segment.export()\">\n" +
    "						<i class=\"fa fa-upload zm-flex-minimal\"></i>\n" +
    "						<span>\n" +
    "							{{ ::t('core.components.toolbar.export') }}\n" +
    "						</span>\n" +
    "					</li>\n" +
    "					\n" +
    "					<!-- CLEAR -->\n" +
    "					<li class=\"zm-show-mobile zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\" ng-disabled=\"!$segment.isValid() || $segment.segment.data.content.childs.length === 0\" ng-click=\"zm.content.clear()\">\n" +
    "						<i class=\"fa fa-eraser zm-flex-minimal\"></i>\n" +
    "						<span>\n" +
    "							{{ ::t('core.components.toolbar.clear') }}\n" +
    "						</span>\n" +
    "					</li>\n" +
    "				</items>\n" +
    "			</zm-tabs>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div ng-if=\"!$device.isLargeEnough()\" class=\"zm-toolbar-inner-bottom zm-clearfix zm-flex-container zm-flex-align-center zm-flex-gap-x\">\n" +
    "		<div class=\"zm-flex-container zm-flex-align-center zm-flex-align-center\">\n" +
    "			\n" +
    "			<!-- NOT CONNECTED, DATA SAVED IN BROWSER -->\n" +
    "			<div ng-if=\"breadcrumbs.length === 0 && $profile.isSignedIn === false\" class=\"zm-toolbar-not-connected-data zm-flex-container zm-flex-gap-x zm-flex-align-center\">\n" +
    "				<i class=\"fa fa-exclamation-circle zm-flex-minimal zm-text-primary\"></i>\n" +
    "				<span class=\"zm-ellipsis\">{{ ::t('core.components.toolbar.notConnectedDataBrowser') }}</span>\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- CONNECTED, NO SEGMENT -->\n" +
    "			<div ng-if=\"breadcrumbs.length === 0 && $profile.isSignedIn === true\" class=\"zm-text-center\">\n" +
    "				<i class=\"fa fa-exclamation-triangle fa-margin-right zm-text-warning\"></i>\n" +
    "				<span>{{ ::t('core.components.toolbar.noSegmentLoaded') }}</span>\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- BREADCRUMBS -->\n" +
    "			<div ng-if=\"breadcrumbs.length > 0\" class=\"zm-breadcrumbs zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap zm-flex-minimal\">\n" +
    "				\n" +
    "				<i class=\"fa fa-cubes fa-margin-right zm-flex-minimal\"></i>\n" +
    "				\n" +
    "				<div class=\"zm-breadcrumb zm-flex-container zm-flex-minimal zm-flex-gap-x zm-flex-nowrap zm-flex-align-center\"\n" +
    "					 ng-repeat=\"breadcrumb in breadcrumbs\"\n" +
    "					 ng-class=\"{ first: $index === 0, last: $index === breadcrumbs.length - 1 }\">\n" +
    "					<span ng-if=\"$index < breadcrumbs.length - 1\">\n" +
    "						{{ breadcrumb.label }}\n" +
    "					</span>\n" +
    "					<zm-tabs ng-if=\"$index === breadcrumbs.length - 1\" anchor=\"top-left\" style=\"flat\">\n" +
    "						<toggle zm-tooltip=\"{{ ::t('core.components.toolbar.tooltip.segment') }}\">\n" +
    "							\n" +
    "							{{ breadcrumb.label }}\n" +
    "							\n" +
    "							<i style=\"font-size: 0.5rem; line-height: 1rem;\" class=\"fa fa-chevron-down\"></i>\n" +
    "						</toggle>\n" +
    "						<items>\n" +
    "							\n" +
    "							<!-- CLOSE -->\n" +
    "							<li class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\" ng-click=\"closeSegment()\">\n" +
    "								<i class=\"fa fa-window-close zm-flex-minimal\"></i>\n" +
    "								<span>\n" +
    "									{{ ::t('core.components.toolbar.closeSegment') }}\n" +
    "								</span>\n" +
    "							</li>\n" +
    "						</items>\n" +
    "					</zm-tabs>\n" +
    "					<i ng-if=\"$index < breadcrumbs.length - 1\" class=\"fa fa-angle-right zm-flex-minimal\"></i>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		\n" +
    "		<!-- SIGN-IN -->\n" +
    "		<div class=\"zm-flex-minimal\">\n" +
    "			<zm-btn ng-if=\"$device.isSmall() && $profile.isSignedIn === false\" class=\"zm-btn-primary zm-nowrap\" zm-tooltip=\"{{ ::t('core.components.toolbar.tooltip.signIn') }}\" ng-click=\"$profile.signIn()\">\n" +
    "				<i class=\"fa fa-sign-in fa-margin-right\"></i>\n" +
    "				{{ ::t('core.components.toolbar.signIn') }}\n" +
    "			</zm-btn>\n" +
    "			\n" +
    "			<!-- USER INFO -->\n" +
    "			<zm-tabs ng-if=\"$profile.isSignedIn === true && $device.isSmall()\" class=\"zm-toolbar-profile-container\" anchor=\"top-left\" style=\"flat\">\n" +
    "				<toggle zm-tooltip=\"{{ ::t('core.components.toolbar.tooltip.myAccount') }}\">\n" +
    "					\n" +
    "					<img ng-src=\"{{ $profile.picture }}\" class=\"zm-profile-pic\" />\n" +
    "					<span>{{ $profile.givenName }}</span>\n" +
    "					\n" +
    "					<i style=\"font-size: 0.5rem; line-height: 1rem;\" class=\"fa fa-chevron-down\"></i>\n" +
    "				</toggle>\n" +
    "				<items>\n" +
    "					\n" +
    "					<!-- SIGN-OUT -->\n" +
    "					<li class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\" ng-click=\"$profile.signOut()\">\n" +
    "						<i class=\"fa fa-sign-out zm-flex-minimal\"></i>\n" +
    "						<span>\n" +
    "							{{ ::t('core.components.toolbar.signOut') }}\n" +
    "						</span>\n" +
    "					</li>\n" +
    "				</items>\n" +
    "			</zm-tabs>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('core/directives/toolbar/toolbar.html',
    "<div class=\"zm-toolbar\" ng-if=\"$toolbar.hasItems()\">\n" +
    "	<div class=\"zm-toolbar-inner zm-clearfix\">\n" +
    "		\n" +
    "		<!-- SECTIONS -->\n" +
    "		<div class=\"zm-toolbar-section-{{ section }} zm-flex-container zm-flex-gap-x zm-flex-align-center\" ng-repeat=\"section in sections\">\n" +
    "			<div class=\"zm-toolbar-item\" ng-repeat=\"item in $toolbar[section] | orderBy: 'priority'\">\n" +
    "				\n" +
    "				<!-- DIRECTIVE -->\n" +
    "				<zm-directive ng-if=\"item.type === 'directive'\" name=\"item.directive\"></zm-directive>\n" +
    "				\n" +
    "				<!-- SEP -->\n" +
    "				<div class=\"zm-btn-sep\" ng-if=\"item.type === 'sep'\"></div>\n" +
    "				\n" +
    "				<!-- BUTTON -->\n" +
    "				<zm-btn ng-if=\"item.type === 'button' && item.isVisible()\" ng-disabled=\"!item.canAccess()\" zm-tooltip=\"{{ ::item.tooltip }}\" class=\"zm-toolbar-item-{{ ::item.name }}\" ng-click=\"item.events.click($event, this)\">\n" +
    "					<i ng-if=\"item.icon\" class=\"fa fa-{{ ::item.icon }}\" ng-class=\"{ 'fa-margin-right': item.title }\"></i>\n" +
    "					<span ng-if=\"item.title\">{{ ::item.title }}</span>\n" +
    "				</zm-btn>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<!--<div ng-if=\"!$device.isLargeEnough()\" class=\"zm-toolbar-inner-bottom zm-clearfix zm-flex-container zm-flex-align-center zm-flex-gap-x\">-->\n" +
    "		\n" +
    "	<!--</div>-->\n" +
    "</div>"
  );


  $templateCache.put('core/directives/unsupported-device/unsupported-device.html',
    "<div class=\"zm-unsupported-device zm-flex-container zm-flex-align-center zm-h100\">\n" +
    "	<div class=\"zm-unsupported-device-inner\">\n" +
    "		<table>\n" +
    "			<tr>\n" +
    "				<td>\n" +
    "					<img src=\"assets/img/logo-empty.png\" alt=\"Zemit logo\" />\n" +
    "				</td>\n" +
    "				<td>\n" +
    "					<h1>{{ ::t('core.directives.unsupported-device.title') }}</h1>\n" +
    "					\n" +
    "					<p ng-bind-html=\"::t('core.directives.unsupported-device.desc', { browser: device._browser.name, version: device._browser.version }) | trustHtml\"></p>\n" +
    "					\n" +
    "					<ul>\n" +
    "						<li><a href=\"http://opera.com\" target=\"_blank\">Opera</a> v{{ device.supportedVersion.opera }}+</li>\n" +
    "						<li><a href=\"https://support.apple.com/downloads/safari\" target=\"_blank\">Safari</a> v{{ device.supportedVersion.safari }}+</li>\n" +
    "						<li><a href=\"https://www.google.com/chrome/browser/desktop/index.html\" target=\"_blank\">Google Chrome</a> v{{ device.supportedVersion.chrome }}+</li>\n" +
    "						<li><a href=\"http://firefox.com\" target=\"_blank\">Firefox</a> v{{ device.supportedVersion.firefox }}+</li>\n" +
    "						<li><a href=\"https://www.microsoft.com/en-ca/windows/microsoft-edge\" target=\"_blank\">Edge</a> v{{ device.supportedVersion.edge }}+</li>\n" +
    "					</ul>\n" +
    "					\n" +
    "					<p><em ng-bind-html=\"::t('core.directives.unsupported-device.notes') | trustHtml\"></em></p>\n" +
    "				</td>\n" +
    "			</tr>\n" +
    "		</table>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/context/context.html',
    "<div>\n" +
    "	<zm-tabs anchor=\"top-left\">\n" +
    "		<toggle zm-tooltip=\"{{ ::t('core.components.toolbar.tooltip.changeMode') }}\">\n" +
    "			\n" +
    "			<i class=\"fa\" ng-class=\"{\n" +
    "				'fa-cubes': settings.context === 'structure',\n" +
    "				'fa-paint-brush': settings.context === 'style',\n" +
    "				'fa-eye': settings.context === 'preview'\n" +
    "			}\"></i>\n" +
    "			\n" +
    "			<span ng-if=\"settings.context === 'structure'\">\n" +
    "				{{ ::t('core.components.toolbar.structure') }}\n" +
    "			</span>\n" +
    "			<span ng-if=\"settings.context === 'preview'\">\n" +
    "				{{ ::t('core.components.toolbar.preview') }}\n" +
    "			</span>\n" +
    "			\n" +
    "			<i style=\"font-size: 0.5rem; line-height: 0.5rem;\" class=\"fa fa-chevron-down\"></i>\n" +
    "		</toggle>\n" +
    "		<items>\n" +
    "			\n" +
    "			<!-- STRUCTURE -->\n" +
    "			<li class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center zm-flex-nowrap\" ng-class=\"{active: settings.context === 'structure'}\" ng-click=\"setTab('structure')\">\n" +
    "				<i class=\"fa fa-cubes zm-flex-minimal\"></i>\n" +
    "				<span>\n" +
    "					{{ ::t('core.components.toolbar.structure') }}\n" +
    "				</span>\n" +
    "				<small ng-if=\"device.isPrecise()\" class=\"zm-shortcut-tip zm-flex-minimal\">ALT + S</small>\n" +
    "			</li>\n" +
    "			\n" +
    "			<!-- PREVIEW -->\n" +
    "			<li class=\"zm-tab-item zm-flex-container zm-flex-gap-x zm-flex-align-center\" ng-class=\"{active: settings.context === 'preview'}\" ng-click=\"setTab('preview')\">\n" +
    "				<i class=\"fa fa-eye zm-flex-minimal\"></i>\n" +
    "				<span>\n" +
    "					{{ ::t('core.components.toolbar.preview') }}\n" +
    "				</span>\n" +
    "				<small ng-if=\"device.isPrecise()\" class=\"zm-shortcut-tip zm-flex-minimal\">ALT + P</small>\n" +
    "			</li>\n" +
    "		</items>\n" +
    "	</zm-tabs>\n" +
    "</div>"
  );


  $templateCache.put('modules/media/media.sidebar.html',
    "<div class=\"zm-sidebar-media zm-flex-container-column zm-h100\">\n" +
    "	\n" +
    "	<div class=\"zm-flex-minimal\">\n" +
    "		\n" +
    "		<!-- NOTICE -->\n" +
    "		<zm-dismissable class=\"zm-flex-minimal\" type=\"info\" key=\"zm-sidebar-media-intro\">\n" +
    "			{{ ::t('modules.media.sidebar.noticeIntro') }}\n" +
    "		</zm-dismissable>\n" +
    "		\n" +
    "		<!-- FILTER -->\n" +
    "		<div class=\"zm-flex-minimal zm-p-2\">\n" +
    "			<zm-field-input type=\"text\" icon=\"search\" placeholder=\"{{ ::t('modules.media.sidebar.filterPlaceholder') }}\" ng-disabled=\"medias.images.length === 0\" ng-model=\"filters.query\" autofocus=\"on\" />\n" +
    "			\n" +
    "			<!-- IF NO MEDIA FOUND -->\n" +
    "			<p ng-if=\"noMediaFound\" style=\"text-align: center\">\n" +
    "				{{ ::t('modules.media.sidebar.noMediaFound') }}\n" +
    "			</p>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"zm-scrollable-y zm-flex-container-column\">\n" +
    "		\n" +
    "		<!-- EMPTY -->\n" +
    "		<div class=\"zm-p-2 zm-text-center zm-flex-container zm-flex-align-center\" ng-if=\"medias.images.length === 0\">\n" +
    "			<div>\n" +
    "				<i class=\"fa fa-exclamation-circle\" style=\"font-size: 2rem\"></i>\n" +
    "				<br />{{ ::t('modules.media.sidebar.empty') }}\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		\n" +
    "		<zm-accordion ng-model=\"settings.images.visible\" ng-if=\"medias.images.length > 0\">\n" +
    "			<header class=\"zm-flex-container zm-flex-gap zm-flex-align-center\">\n" +
    "				<span class=\"zm-sidebar-title-text\">\n" +
    "					{{ ::t('modules.media.sidebar.images') }}\n" +
    "				</span>\n" +
    "				\n" +
    "				<!-- TOTAL NODES -->\n" +
    "				<div class=\"zm-badge zm-flex-minimal\">\n" +
    "					{{ medias.images.length }}\n" +
    "				</div>\n" +
    "				\n" +
    "				<i class=\"fa zm-pull-right zm-flex-minimal\" ng-class=\"{'fa-chevron-down': settings.images.visible, 'fa-chevron-right': !tabs.images.visible}\"></i>\n" +
    "			</header>\n" +
    "			<content>\n" +
    "				\n" +
    "				<!-- LIST OF ITEMS (REPEAT) -->\n" +
    "				<div zm-draggable=\"draggableOptions\" zm-draggable-item=\"image.media\" class=\"zm-sidebar-media-item zm-media-item\" ng-repeat=\"image in medias.images\">\n" +
    "					<div class=\"zm-sidebar-media-item-image\">\n" +
    "						<img ng-src=\"{{ ::image.src }}\" />\n" +
    "					</div>\n" +
    "					<div class=\"zm-sidebar-media-item-desc\">\n" +
    "						{{ ::image.media.getFile().name }}\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</content>\n" +
    "		</zm-accordion>\n" +
    "	</div>\n" +
    "	<div class=\"zm-flex-minimal\">\n" +
    "		\n" +
    "		<!-- ADD MEDIA -->\n" +
    "		<div class=\"zm-p-2 zm-flex-minimal\">\n" +
    "			<zm-btn class=\"zm-w100 zm-btn-primary\" ng-click=\"add()\">\n" +
    "				<i class=\"fa fa-link fa-margin-right\"></i>\n" +
    "				{{ ::t('modules.media.sidebar.btnAddMedia') }}\n" +
    "			</zm-btn>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/debug/debug.html',
    "<div class=\"zm-widget-debug\" ng-if=\"$settings.debug.activated && $settings.debug.settings.showWidgetTokenId && $settings.context !== 'preview'\">\n" +
    "	<div class=\"zm-widget-debug-item\">\n" +
    "		<label>TOKEN:</label> {{ widget.token }}\n" +
    "	</div>\n" +
    "	<div class=\"zm-widget-debug-item\">\n" +
    "		<label>ID:</label> {{ widget.id }}\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/default/add/add.html',
    "<div class=\"zm-widget-modal-add-widget\">\n" +
    "	\n" +
    "	<!-- TABS -->\n" +
    "	<ul class=\"zm-tabs\">\n" +
    "		<li class=\"zm-tab-item\" ng-click=\"tab.current = key\" ng-class=\"{active: tab.current === key}\" ng-repeat=\"(key, item) in items\">{{ ::item.title }}</li>\n" +
    "	</ul>\n" +
    "	\n" +
    "	<div class=\"zm-mt-3 zm-flex-container zm-flex-gap\" ng-repeat=\"row in items[tab.current].rows\">\n" +
    "		\n" +
    "		<!-- LIST OF ITEMS (REPEAT) -->\n" +
    "		<div class=\"zm-widget-add-item\" ng-click=\"addWidget(item)\" ng-repeat=\"item in row\" zm-clickable>\n" +
    "			\n" +
    "			<!-- ICON -->\n" +
    "			<div class=\"zm-widget-add-item-icon\" ng-if=\"item.icon\">\n" +
    "				<i class=\"fa fa-{{ item.icon }}\"></i>\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- TITLE -->\n" +
    "			<h4 class=\"zm-widget-add-item-title\" ng-if=\"item.title\">\n" +
    "				{{ item.title }}\n" +
    "			</h4>\n" +
    "			\n" +
    "			<!-- DESCRIPTION -->\n" +
    "			<p class=\"zm-widget-add-item-desc zm-mt-0\" ng-if=\"item.desc\">\n" +
    "				{{ item.desc }}\n" +
    "			</p>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/default/childs/childs.html',
    "<div class=\"zm-widget-child zm-widget-child-type-{{ ::widget.type }}\" ng-class=\"{'zm-widget-childs-empty': widget.childs.length === 0}\" ng-repeat=\"widget in widget.childs\">\n" +
    "	\n" +
    "	<!-- ADD WIDGET BEFORE -->\n" +
    "	<div ng-if=\"false && settings.context === 'structure' && !dropActivated && widget.getScope().position.y < 50\" class=\"zm-widget-child-add zm-widget-add-before\">\n" +
    "		<div class=\"zm-widget-add-sep\" ng-click=\"add($index); $event.stopPropagation()\" zm-clickable zm-zoomable>\n" +
    "			<i class=\"fa fa-plus-circle\"></i>\n" +
    "		</div>\n" +
    "		<div class=\"zm-widget-add-sep-highlight\"></div>\n" +
    "	</div>\n" +
    "	\n" +
    "	<!-- CHILDS -->\n" +
    "	<zm-widget type=\"{{ ::widget.type }}\" default-template=\"{{ ::defaultTemplate }}\"></zm-widget>\n" +
    "	\n" +
    "	<!-- ADD WIDGET AFTER -->\n" +
    "	<div ng-if=\"false && settings.context === 'structure' && !dropActivated && widget.getScope().position.y >= 50\" class=\"zm-widget-child-add zm-widget-add-after\">\n" +
    "		<div class=\"zm-widget-add-sep\" ng-click=\"add($index + 1); $event.stopPropagation()\" zm-clickable zm-zoomable>\n" +
    "			<i class=\"fa fa-plus-circle\"></i>\n" +
    "		</div>\n" +
    "		<div class=\"zm-widget-add-sep-highlight\"></div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/default/default.html',
    "<div class=\"zm-widget-default\">\n" +
    "	<div class=\"zm-widget-heading\">\n" +
    "		\n" +
    "		<!-- DEBUG -->\n" +
    "		<zm-widget-debug widget=\"widget\" />\n" +
    "	</div>\n" +
    "	<div class=\"zm-widget-inner zm-widget-highlightable zm-widget-item zm-draggable zm-widget-drop-inside\" ng-class=\"{\n" +
    "		'zm-widget-adjust-size-top': settings.context === 'structure' && !dropActivated && widget.getScope().position.border.top,\n" +
    "		'zm-widget-adjust-size-bottom': settings.context === 'structure' && !dropActivated && widget.getScope().position.border.bottom,\n" +
    "		'zm-widget-adjust-size-left': settings.context === 'structure' && !dropActivated && widget.getScope().position.border.left,\n" +
    "		'zm-widget-adjust-size-right': settings.context === 'structure' && !dropActivated && widget.getScope().position.border.right\n" +
    "	}\">\n" +
    "		<!-- INNER CONTENT (INJECTED DYNAMICALLY) -->\n" +
    "	</div>\n" +
    "	<div ng-if=\"false\" class=\"zm-widget-footer\">\n" +
    "		\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/default/toolbar/toolbar.html',
    ""
  );


  $templateCache.put('modules/widget/widget.sidebar.html',
    "<div class=\"zm-sidebar-widgets zm-flex-container-column zm-h100\">\n" +
    "		\n" +
    "	<div class=\"zm-flex-minimal\">\n" +
    "		\n" +
    "		<!-- NOTICE -->\n" +
    "		<zm-dismissable type=\"info\" key=\"zm-sidebar-widgets-hold\">\n" +
    "			<span ng-if=\"device._isTouch && !device._isPrecise\">{{ ::t('core.components.sidebar.widgets.noticesMobileDrag') }}</span>\n" +
    "			<span ng-if=\"device._isPrecise\">{{ ::t('core.components.sidebar.widgets.noticesDesktopDrag') }}</span>\n" +
    "		</zm-dismissable>\n" +
    "		\n" +
    "		<!-- FILTER -->\n" +
    "		<div class=\"zm-p-2\">\n" +
    "			<zm-field-input type=\"text\" icon=\"search\" placeholder=\"{{ ::t('core.components.sidebar.widgets.filterPlaceholder') }}\" ng-model=\"filters.query\" ng-disbaled=\"sections.length === 0\" autofocus=\"on\" />\n" +
    "			\n" +
    "			<!-- IF NO WIDGET FOUND -->\n" +
    "			<p ng-if=\"!noWidgetsAvailable && noWidgetsFound\" style=\"text-align: center\">\n" +
    "				{{ ::t('core.components.sidebar.widgets.noWidgetsFound') }}\n" +
    "			</p>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div class=\"zm-scrollable-y zm-flex-container-column\">\n" +
    "		\n" +
    "		<!-- EMPTY -->\n" +
    "        <div class=\"zm-p-2 zm-text-center zm-flex-container zm-flex-align-center\" ng-if=\"noWidgetsAvailable\">\n" +
    "            <div>\n" +
    "                <i class=\"fa fa-exclamation-circle\" style=\"font-size: 2rem\"></i>\n" +
    "                <br />{{ ::t('core.components.sidebar.media.empty') }}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "		\n" +
    "		<!-- TABS -->\n" +
    "		<zm-accordion ng-model=\"$root.settings.sidebar.widgets.tabs[key].visible\" ng-if=\"section.widgets.length > 0\" ng-repeat=\"(key, section) in sections\">\n" +
    "			<header class=\"zm-flex-container zm-flex-gap zm-flex-align-center\">\n" +
    "				<span class=\"zm-sidebar-title-text\">\n" +
    "					{{ ::section.title }}\n" +
    "				</span>\n" +
    "				\n" +
    "				<!-- TOTAL NODES -->\n" +
    "				<div class=\"zm-badge zm-flex-minimal\">\n" +
    "					{{ section.widgets.length }}\n" +
    "				</div>\n" +
    "				\n" +
    "				<!-- CHEVRON -->\n" +
    "				<i class=\"fa zm-pull-right zm-flex-minimal\" ng-class=\"{'fa-chevron-down': $root.settings.sidebar.widgets.tabs[key].visible, 'fa-chevron-right': !$root.settings.sidebar.widgets.tabs[key].visible}\"></i>\n" +
    "			</header>\n" +
    "			<content>\n" +
    "				<zm-field class=\"zm-p-2\">\n" +
    "					<div ng-if=\"section.widgets.length > 0\" class=\"zm-flex-container zm-flex-gap zm-flex-equal-size\">\n" +
    "						\n" +
    "						<!-- LIST OF ITEMS (REPEAT) -->\n" +
    "						<div zm-draggable=\"draggableOptions\" zm-draggable-item=\"dragWidget\" ng-init=\"dragWidget = { type: widget.type }\" class=\"zm-sidebar-widgets-item zm-widget-item\" ng-repeat=\"widget in section.widgets\">\n" +
    "							<div class=\"zm-vertical-align-middle\">\n" +
    "								\n" +
    "								<!-- ICON -->\n" +
    "								<div class=\"zm-sidebar-widgets-item-icon\" ng-if=\"widget.icon\">\n" +
    "									<i class=\"fa fa-{{ ::widget.icon }}\"></i>\n" +
    "								</div>\n" +
    "								\n" +
    "								<!-- TITLE -->\n" +
    "								<h4 class=\"zm-sidebar-widgets-item-title\" ng-if=\"widget.title\">\n" +
    "									{{ widget.title }}\n" +
    "								</h4>\n" +
    "								\n" +
    "								<!-- DESCRIPTION -->\n" +
    "								<p class=\"zm-sidebar-widgets-item-desc\" ng-if=\"widget.desc\">\n" +
    "									{{ widget.desc }}\n" +
    "								</p>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</zm-field>\n" +
    "			</content>\n" +
    "		</zm-accordion>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/widget/column/column.html',
    "<div style=\"flex: {{ column.size }}\" class=\"zm-flex-container-column\" ng-class=\"{'zm-divide-hover': divide.isHover, 'zm-is-resizing': resize.isResizing}\">\n" +
    "	<div class=\"zm-widget-heading zm-flex-minimal\">\n" +
    "		\n" +
    "		<!-- DEBUG -->\n" +
    "		<zm-widget-debug widget=\"widget\" />\n" +
    "		\n" +
    "		<!-- RESIZE HANDLER -->\n" +
    "		<div ng-click=\"$event.stopPropagation()\" ng-mouseenter=\"$event.stopPropagation()\" ng-show=\"settings.context === 'structure' && !dropActivated && $index !== row.childs.length - 1\" class=\"zm-widget-column-resize-handler\" ng-class=\"{active: resize.handlerActive}\">\n" +
    "			<div class=\"zm-widget-column-resize-handler-bar\">\n" +
    "				<div class=\"zm-bar\"></div>\n" +
    "				<div class=\"zm-bar\"></div>\n" +
    "				<div class=\"zm-bar\"></div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		\n" +
    "		<!-- SEPARATOR -->\n" +
    "		<!--<div class=\"zm-widget-resize-overlay\" ng-if=\"resize.isResizing\"></div>-->\n" +
    "		<!--<div ng-if=\"column.size > 1\" class=\"zm-widget-divide\">-->\n" +
    "		<!--	<i ng-click=\"divide.action($event)\" ng-mouseenter=\"divide.isHover = true\" ng-mouseleave=\"divide.isHover = false\" class=\"fa fa-scissors\" zm-clickable zm-zoomable></i>-->\n" +
    "		<!--</div>-->\n" +
    "	</div>\n" +
    "	\n" +
    "	<div class=\"zm-widget-inner zm-widget-highlightable zm-widget-item zm-draggable\" zm-accept-widget-inside>\n" +
    "		\n" +
    "		<!-- SIZE -->\n" +
    "		<div ng-if=\"settings.context === 'structure'\" zm-visible=\"resize.isResizing\" class=\"zm-widget-column-size\">\n" +
    "			<span class=\"zm-widget-column-size-number\">{{ widget.size }}</span>\n" +
    "		</div>\n" +
    "		\n" +
    "		<!-- LIST OF CHILD WIDGETS -->\n" +
    "		<zm-widget-childs></zm-widget-childs>\n" +
    "		\n" +
    "		<!-- ADD WIDGET (EMPTY) -->\n" +
    "		<div ng-if=\"settings.context === 'structure' && column.childs.length === 0\" ng-class=\"{hide: divide.isHover}\" class=\"zm-widget-add\">\n" +
    "			<i ng-click=\"panel.open(column); $event.stopPropagation()\" class=\"fa fa-plus\" zm-clickable zm-zoomable></i>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/widget/container/container.html',
    "<div class=\"zm-container zm-flex-container zm-context-{{ settings.context }}\" ng-class=\"{ 'zm-container-show-content': showContent }\">\n" +
    "	<div class=\"zm-container-inner\">\n" +
    "		<div class=\"zm-flex-container-column\" style=\"height: 100%\">\n" +
    "			\n" +
    "			<!-- NO SEGMENT -->\n" +
    "			<div ng-if=\"!$segment.isValid()\" class=\"zm-container-no-segment zm-flex-container zm-flex-align-center zm-p-3\">\n" +
    "				<span style=\"text-align: center\">\n" +
    "					<i class=\"fa fa-exclamation-triangle fa-margin-right\"></i>\n" +
    "					{{ ::t('core.components.widget.container.no-segment') }}\n" +
    "				</span>\n" +
    "			</div>\n" +
    "			\n" +
    "			<div ng-show=\"$segment.isValid()\" class=\"zm-container-scrollable\" ng-click=\"zm.widget.unselectAll()\" zm-accept-widget-inside>\n" +
    "				\n" +
    "				<!-- LIST OF CHILD WIDGETS -->\n" +
    "				<zm-widget-childs type=\"'row'\" childs=\"container.childs\"></zm-widget-childs>\n" +
    "				\n" +
    "				<!-- ADD ROW -->\n" +
    "				<!--<div class=\"zm-container-add-row\" ng-if=\"$segment.segment.data.content.childs.length === 0\">-->\n" +
    "				<!--	<i class=\"fa fa-plus-circle\" zm-clickable zm-zoomable ng-click=\"container.addChild('row')\"></i>-->\n" +
    "				<!--</div>-->\n" +
    "			</div>\n" +
    "			\n" +
    "			<div class=\"zm-container-notices zm-flex-minimal\" ng-slide-y=\"settings.directives.dismissable.visible\">\n" +
    "				<div class=\"zm-container-notices-scrollable\">\n" +
    "					\n" +
    "					<!-- NOTICES -->\n" +
    "					<zm-dismissable list=\"notices\"></zm-dismissable>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- QUICK ACTIONS -->\n" +
    "			<div ng-if=\"settings.context !== 'preview'\" class=\"zm-quick-actions zm-flex-minimal zm-p-2\">\n" +
    "				<div class=\"zm-flex-container zm-flex-gap-x\">\n" +
    "					\n" +
    "					<zm-tabs anchor=\"bottom-left\" ng-disabled=\"zm.widget.totalSelected === 0\" zm-tabs-keep-open>\n" +
    "						<items>\n" +
    "							\n" +
    "							<!-- REMOVE -->\n" +
    "							<li class=\"zm-tab-item zm-flex-container zm-flex-gap zm-flex-align-center zm-flex-nowrap\" ng-click=\"zm.action(zm.widget.removeAllSelected)\">\n" +
    "								<i class=\"fa fa-trash-o zm-flex-minimal\"></i>\n" +
    "								<span>\n" +
    "									{{ ::t('core.components.widget.container.actions.remove') }}\n" +
    "								</span>\n" +
    "								<small ng-if=\"device.isPrecise()\" class=\"zm-shortcut-tip zm-flex-minimal\">\n" +
    "									<i ng-if=\"device.isMac()\" class=\"fa fa-apple\"></i>\n" +
    "									<span ng-if=\"!device.isMac()\">CTRL</span>\n" +
    "									+ DEL\n" +
    "								</small>\n" +
    "							</li>\n" +
    "							\n" +
    "							<!-- DUPLICATE -->\n" +
    "							<li class=\"zm-tab-item zm-flex-container zm-flex-gap zm-flex-align-center zm-flex-nowrap\" ng-click=\"zm.action(zm.widget.duplicate)\">\n" +
    "								<i class=\"fa fa-copy zm-flex-minimal\"></i>\n" +
    "								<span>\n" +
    "									{{ ::t('core.components.widget.container.actions.duplicate') }}\n" +
    "								</span>\n" +
    "								<small ng-if=\"device.isPrecise()\" class=\"zm-shortcut-tip zm-flex-minimal\">\n" +
    "									<i ng-if=\"device.isMac()\" class=\"fa fa-apple\"></i>\n" +
    "									<span ng-if=\"!device.isMac()\">CTRL</span>\n" +
    "									+ D\n" +
    "								</small>\n" +
    "							</li>\n" +
    "						</items>\n" +
    "					</zm-tabs>\n" +
    "					\n" +
    "					<!-- EDIT -->\n" +
    "					<zm-btn style=\"flex: 3\" ng-disabled=\"!zm.widget.canEdit()\" ng-click=\"zm.widget.edit()\">\n" +
    "						<i class=\"fa fa-pencil fa-margin-right\"></i>\n" +
    "						{{ ::t('core.components.widget.container.actions.edit') }}\n" +
    "					</zm-btn>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"zm-container-overlays\"></div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/widget/disabled/disabled.html',
    "<div class=\"zm-widget-disabled-container\" ng-if=\"isLoaded\">\n" +
    "	<i class=\"fa fa-exclamation-triangle\"></i>\n" +
    "	\n" +
    "	This widget type <strong>{{ ::widget.type }}</strong> does not exist. Please verify that all dependencies are activated in your module list.\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/widget/image/image.html',
    "<div class=\"zm-widget-image-container\" ng-if=\"isLoaded\" zm-dropzone=\"dropzoneOptions\">\n" +
    "	\n" +
    "	<!-- EMPTY -->\n" +
    "	<div ng-if=\"!widget.mediaId\" class=\"zm-widget-image-empty\">\n" +
    "		<i class=\"fa fa-image\"></i>\n" +
    "	</div>\n" +
    "	\n" +
    "	<!-- STRUCTURE -->\n" +
    "	<div id=\"media_structure_{{ widget.mediaId }}\" ng-if=\"settings.context === 'structure' && widget.mediaId\" class=\"zm-widget-image-ready\">\n" +
    "		<!-- Leave empty -->\n" +
    "	</div>\n" +
    "	\n" +
    "	<!-- PREVIEW -->\n" +
    "	<img ng-if=\"settings.context === 'preview' && widget.mediaId\" ng-src=\"{{ src.thumbnail }}\" ng-srcset=\"{{ src.thumbnail }} 480w, {{ src.small }} 768w, {{ src.medium }} 1280w, {{ src.large }} 1920w, {{ src.retina }} 2660w\" />\n" +
    "	\n" +
    "	<!-- RESPONSIVE BACKGROUND IMAGE (STRUCTURE) -->\n" +
    "	<style ng-if=\"widget.mediaId\">\n" +
    "		\n" +
    "		/* Thumbnail */\n" +
    "		@media all and (max-width: 480px) {\n" +
    "			#media_structure_{{ widget.mediaId }} {\n" +
    "				background-image: url('{{ src.thumbnail }}');\n" +
    "			}\n" +
    "		}\n" +
    "		/* Small */\n" +
    "		@media all and (min-width: 481px) and (max-width: 768px) {\n" +
    "			#media_structure_{{ widget.mediaId }} {\n" +
    "				background-image: url('{{ src.small }}');\n" +
    "			}\n" +
    "		}\n" +
    "		/* Medium */\n" +
    "		@media all and (min-width: 769px) and (max-width: 1280px) {\n" +
    "			#media_structure_{{ widget.mediaId }} {\n" +
    "				background-image: url('{{ src.medium }}');\n" +
    "			}\n" +
    "		}\n" +
    "		/* Large */\n" +
    "		@media all and (min-width: 1281px) and (max-width: 1920px) {\n" +
    "			#media_structure_{{ widget.mediaId }} {\n" +
    "				background-image: url('{{ src.large }}');\n" +
    "			}\n" +
    "		}\n" +
    "		/* Retina */\n" +
    "		@media all and (min-width: 1921px) and (max-width: 2660px) {\n" +
    "			#media_structure_{{ widget.mediaId }} {\n" +
    "				background-image: url('{{ src.retina }}');\n" +
    "			}\n" +
    "		}\n" +
    "	</style>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/widget/row/row.html',
    "<div class=\"zm-widget-row\">\n" +
    "	<div class=\"zm-widget-heading\">\n" +
    "		\n" +
    "		<!-- DEBUG -->\n" +
    "		<zm-widget-debug widget=\"widget\" />\n" +
    "	</div>\n" +
    "	<div class=\"zm-widget-row-empty zm-widget-highlightable zm-selected-bg\" ng-if=\"row.childs.length === 0 && settings.context === 'structure'\">\n" +
    "		\n" +
    "		<!-- COLUMNS SELECTOR -->\n" +
    "		<div class=\"zm-widget-row-add-columns zm-flex-container\">\n" +
    "			<div class=\"zm-widget-row-add-column-item zm-widget-row-add-column-item-{{ ::amount }}\" ng-repeat=\"amount in [1,2,3,4,6]\" ng-click=\"addColumns(amount)\" zm-clickable zm-zm-zoomable>\n" +
    "				<span class=\"zm-widget-row-add-column-item-amount\">{{ ::amount }}</span>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div ng-show=\"row.childs.length > 0\" class=\"zm-widget-inner zm-widget-highlightable zm-widget-item zm-draggable\" zm-accept-widget-inside>\n" +
    "		\n" +
    "		<!-- LIST OF CHILD WIDGETS -->\n" +
    "		<zm-widget type=\"column\" ng-repeat=\"widget in row.childs\"></zm-widget>\n" +
    "	</div>\n" +
    "	<div class=\"zm-widget-footer\" ng-if=\"false\">\n" +
    "		\n" +
    "		<!-- COLUMNS PREVIEWER -->\n" +
    "		<!--<div ng-if=\"row.childs.length === 0\" class=\"zm-widget-row-add-column-preview zm-flex-container\" ng-class=\"{'zm-widget-row-preview-visible': previewer.hoveredAmount > 0}\">-->\n" +
    "		<!--	<div class=\"zm-widget-row-add-column-preview-item\" ng-class=\"{'zm-widget-row-preview-item-visible': amount <= previewer.hoveredAmount}\" ng-repeat=\"amount in previewer.columns track by $index\"></div>-->\n" +
    "		<!--</div>-->\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/widget/text/text.html',
    "<div class=\"zm-widget-text\">\n" +
    "	\n" +
    "	<!-- CONTENT -->\n" +
    "	<div class=\"zm-text-content\" ng-bind-html=\"text | trustHtml\"></div>\n" +
    "</div>"
  );


  $templateCache.put('modules/widget/widget/text/text.overlay.html',
    "<div class=\"zm-text-content-editor\">\n" +
    "	<!--\n" +
    "		Editable contents in the DOM are marked with tabindex in the background, so in order for your div to receive the onfocus event, you need to explicitly declare the div's tabindex property.\n" +
    "		https://stackoverflow.com/a/35385295/538323\n" +
    "	-->\n" +
    "	<div class=\"zm-text-content-editor-text\" ng-click=\"$event.preventDefault()\" tabindex=\"1\" contenteditable=\"true\" ng-bind-html=\"text | trustHtml\"></div>\n" +
    "</div>"
  );


  $templateCache.put('modules/workspace/modals/connect/connect.html',
    "<div class=\"zm-workspace-modal-create zm-nowrap\">\n" +
    "	<div class=\"zm-form-group zm-row zm-flex-align-center\">\n" +
    "		<label class=\"zm-col-12 zm-col-sm-4 zm-mb-2 zm-mb-sm-0\">{{ ::t('core.components.sidebar.workspace.connect.envTitle') }}</label>\n" +
    "		<div class=\"zm-col-12 zm-col-sm-8\">\n" +
    "			<label zm-tooltip=\"{{ ::t('core.components.sidebar.workspace.connect.localTooltip') }}\">\n" +
    "				<input ng-disabled=\"!workspace.isNew()\" type=\"radio\" ng-model=\"workspace.data.env\" value=\"local\" />\n" +
    "				{{ ::t('core.components.sidebar.workspace.connect.local') }}\n" +
    "			</label>\n" +
    "			<label class=\"zm-ml-3\">\n" +
    "				<input ng-disabled=\"!workspace.isNew()\" type=\"radio\" ng-model=\"workspace.data.env\" value=\"remote\" />\n" +
    "				{{ ::t('core.components.sidebar.workspace.connect.remote') }}\n" +
    "			</label>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<hr class=\"zm-my-3\" />\n" +
    "	<div class=\"zm-form-group zm-row zm-mt-3 zm-flex-align-center\">\n" +
    "		<label class=\"zm-col-12 zm-col-sm-4 zm-mb-2 zm-mb-sm-0\">{{ ::t('core.components.sidebar.workspace.connect.nameTitle') }} <span ng-if=\"workspace.data.env !== 'remote'\" class=\"zm-text-danger\">*</span></label>\n" +
    "		<zm-field-input type=\"text\" class=\"zm-col-12 zm-col-sm-8\" icon=\"tag\" placeholder=\"{{ ::t('core.components.sidebar.workspace.connect.namePlaceholder') }}\" ng-model=\"workspace.data.name\" autofocus=\"on\" />\n" +
    "	</div>\n" +
    "	<div class=\"zm-form-group zm-row zm-mt-2 zm-flex-align-center\">\n" +
    "		<label class=\"zm-col-12 zm-col-sm-4 zm-mb-2 zm-mb-sm-0\">{{ ::t('core.components.sidebar.workspace.connect.hostTitle') }} <span class=\"zm-text-danger\">*</span></label>\n" +
    "		<zm-field-input type=\"text\" ng-disabled=\"workspace.data.env !== 'remote'\" class=\"zm-col-12 zm-col-sm-8\" icon=\"database\" placeholder=\"{{ ::t('core.components.sidebar.workspace.connect.hostPlaceholder') }}\" ng-model=\"workspace.data.host\" />\n" +
    "	</div>\n" +
    "	<div class=\"zm-form-group zm-row zm-mt-2 zm-flex-align-center\">\n" +
    "		<label class=\"zm-col-12 zm-col-sm-4 zm-mb-2 zm-mb-sm-0\">{{ ::t('core.components.sidebar.workspace.connect.userTitle') }}</label>\n" +
    "		<zm-field-input type=\"text\" autocomplete=\"username\" ng-disabled=\"workspace.data.env !== 'remote'\" class=\"zm-col-12 zm-col-sm-8\" icon=\"user\" placeholder=\"{{ ::t('core.components.sidebar.workspace.connect.userPlaceholder') }}\" ng-model=\"workspace.data.user\" />\n" +
    "	</div>\n" +
    "	<div class=\"zm-form-group zm-row zm-mt-2 zm-flex-align-center\">\n" +
    "		<label class=\"zm-col-12 zm-col-sm-4 zm-mb-2 zm-mb-sm-0\">{{ ::t('core.components.sidebar.workspace.connect.passTitle') }}</label>\n" +
    "		<zm-field-input type=\"password\" autocomplete=\"new-password\" ng-disabled=\"workspace.data.env !== 'remote'\" class=\"zm-col-12 zm-col-sm-8\" icon=\"lock\" placeholder=\"********\" ng-model=\"workspace.data.password\" />\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/workspace/modals/project/project.html',
    "<div class=\"zm-workspace-modal-project\">\n" +
    "	<div class=\"zm-form-group zm-row zm-flex-align-center\">\n" +
    "		<label class=\"zm-col-12 zm-col-sm-3 zm-mb-2 zm-mb-sm-0\">{{ ::t('core.components.sidebar.workspace.project.nameTitle') }}</label>\n" +
    "		<zm-field-input type=\"text\" class=\"zm-col-12 zm-col-sm-9\" icon=\"sitemap\" placeholder=\"{{ ::t('core.components.sidebar.workspace.project.namePlaceholder') }}\" ng-model=\"project.data.name\" autofocus />\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/workspace/modals/segment/segment.html',
    "<div class=\"zm-workspace-modal-segment\">\n" +
    "	<div class=\"zm-form-group zm-row zm-flex-align-center\">\n" +
    "		<label class=\"zm-col-12 zm-col-sm-3 zm-mb-2 zm-mb-sm-0\">{{ ::t('core.components.sidebar.workspace.segment.nameTitle') }}</label>\n" +
    "		<zm-field-input type=\"text\" class=\"zm-col-12 zm-col-sm-9\" icon=\"cubes\" placeholder=\"{{ ::t('core.components.sidebar.workspace.segment.namePlaceholder') }}\" ng-model=\"segment.data.name\" autofocus />\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/workspace/treeview/project.toolbar.html',
    "<!-- CHEVRON -->\n" +
    "<i class=\"fa zm-pull-right zm-flex-minimal\" ng-class=\"{\n" +
    "    'fa-chevron-down': lvlSettings.viewItems,\n" +
    "    'fa-chevron-right': !lvlSettings.viewItems\n" +
    "}\"></i>\n" +
    "\n" +
    "<span class=\"zm-sidebar-title-text\">\n" +
    "    {{ node.title }}\n" +
    "</span>\n" +
    "\n" +
    "<!-- TOTAL NODES -->\n" +
    "<div class=\"zm-badge zm-flex-minimal\" ng-class=\"{ 'zm-empty': filter(node.childs).length === 0 }\">\n" +
    "	{{ filter(node.childs).length }}\n" +
    "</div>\n" +
    "\n" +
    "<!-- OPTIONS -->\n" +
    "<div class=\"zm-flex-minimal\" ng-include=\"defaultLvlOptions\"></div>"
  );


  $templateCache.put('modules/workspace/treeview/segment.before.html',
    "<div class=\"zm-pr-3\">\n" +
    "	<div class=\"zm-flex-container zm-flex-align-center zm-flex-gap-x\">\n" +
    "		<div>\n" +
    "			<strong>{{ ::$root.t('core.components.sidebar.workspace.treeview.segmentTotalWidgets') }}</strong>\n" +
    "			{{ node.data.getTotalWidgets() }}\n" +
    "		</div>\n" +
    "		<zm-field>\n" +
    "			<zm-btn ng-disabled=\"lvlOptions.isCurrentSegment(node.data)\" class=\"zm-btn-default\" ng-click=\"lvlOptions.onOpen(node.data, parent.data, depth)\">\n" +
    "				{{ ::$root.t('core.components.sidebar.workspace.segmentOpen') }}\n" +
    "			</zm-btn>\n" +
    "		</zm-field>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/workspace/treeview/segment.toolbar.html',
    "<!-- CHEVRON -->\n" +
    "<i class=\"fa zm-pull-right zm-flex-minimal\" ng-class=\"{\n" +
    "    'fa-chevron-down': lvlSettings.viewItems,\n" +
    "    'fa-chevron-right': !lvlSettings.viewItems\n" +
    "}\"></i>\n" +
    "\n" +
    "<span class=\"zm-sidebar-title-text zm-nowrap\">\n" +
    "    {{ node.title }}\n" +
    "</span>\n" +
    "\n" +
    "<!-- OPTIONS -->\n" +
    "<div class=\"zm-flex-minimal\" ng-include=\"defaultLvlOptions\"></div>"
  );


  $templateCache.put('modules/workspace/treeview/workspace.before.html',
    "<!-- ERROR -->\n" +
    "<zm-dismissable ng-if=\"node.error.message\" locked type=\"warning\">\n" +
    "	{{ model.error.message }}\n" +
    "	\n" +
    "	— <a href ng-click=\"node.reconnect()\">{{ ::t('core.components.sidebar.workspace.tryAgain') }}</a>\n" +
    "</zm-dismissable>\n" +
    "\n" +
    "<!-- NO PROJECT -->\n" +
    "<div class=\"zm-text-center zm-flex-container zm-flex-align-center\" ng-if=\"lvlList.length === 0\">\n" +
    "    <i class=\"fa fa-exclamation-circle fa-margin-right zm-flex-minimal\"></i>\n" +
    "    {{ ::$root.t('core.components.sidebar.workspace.emptyProjectLabel') }}\n" +
    "</div>"
  );


  $templateCache.put('modules/workspace/treeview/workspace.toolbar.html',
    "<!-- STATUS -->\n" +
    "<div class=\"zm-flex-minimal\" ng-if=\"node.data.getData().env === 'remote'\">\n" +
    "    <i class=\"fa fa-circle\" ng-class=\"{\n" +
    "        'zm-text-success': node.data.connected,\n" +
    "        'zm-text-danger': node.data.error\n" +
    "    }\"></i>\n" +
    "</div>\n" +
    "\n" +
    "<!-- CHEVRON -->\n" +
    "<i class=\"fa zm-pull-right zm-flex-minimal\" ng-if=\"node.data.getData().env === 'local'\" ng-class=\"{\n" +
    "    'fa-chevron-down': lvlSettings.viewItems,\n" +
    "    'fa-chevron-right': !lvlSettings.viewItems\n" +
    "}\"></i>\n" +
    "\n" +
    "<span class=\"zm-sidebar-title-text\">\n" +
    "    {{ node.title }}\n" +
    "</span>\n" +
    "\n" +
    "<!-- TOTAL NODES -->\n" +
    "<div class=\"zm-badge zm-flex-minimal\" ng-class=\"{ 'zm-empty': filter(node.childs).length === 0 }\">\n" +
    "	{{ filter(node.childs).length }}\n" +
    "</div>\n" +
    "\n" +
    "<!-- OPTIONS -->\n" +
    "<div class=\"zm-flex-minimal\" ng-include=\"defaultLvlOptions\"></div>"
  );


  $templateCache.put('modules/workspace/workspace.sidebar.html',
    "<div class=\"zm-sidebar-workspace zm-flex-container-column zm-h100\">\n" +
    "    \n" +
    "    <div class=\"zm-flex-minimal\">\n" +
    "        \n" +
    "        <!-- NOTICE -->\n" +
    "    	<zm-dismissable class=\"zm-flex-minimal\" type=\"info\" key=\"zm-sidebar-workspace-first-time\">\n" +
    "    	    {{ ::t('core.components.sidebar.workspace.noticeExplanation') }}\n" +
    "    	</zm-dismissable>\n" +
    "    	\n" +
    "    	<!-- FILTER -->\n" +
    "        <div class=\"zm-p-2 zm-flex-minimal\">\n" +
    "            <zm-field-input type=\"text\" icon=\"search\" ng-disabled=\"treeviewWorkspaces.length === 0\" placeholder=\"{{ ::t('core.components.sidebar.workspace.filterPlaceholder') }}\" ng-model=\"filters.query\" autofocus=\"on\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"zm-flex-container-column\" zm-scrollable=\"{ direction: 'y', key: 'workspace' }\">\n" +
    "        \n" +
    "        <!-- EMPTY -->\n" +
    "        <div class=\"zm-p-2 zm-text-center zm-flex-container zm-flex-align-center\" ng-if=\"treeviewWorkspaces.length === 0\">\n" +
    "            <div>\n" +
    "                <i class=\"fa fa-exclamation-circle\" style=\"font-size: 2rem\"></i>\n" +
    "                <br />{{ ::t('core.components.sidebar.workspace.noWorkspaceJoined') }}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <!-- TREEVIEW -->\n" +
    "    	<zm-field-treeview ng-if=\"treeviewWorkspaces.length > 0\" filter=\"filters.query\" list=\"treeviewWorkspaces\" scope=\"this\" depth=2 options=\"treeviewOptions\"></zm-field-treeview>\n" +
    "    </div>\n" +
    "    <div class=\"zm-flex-minimal\">\n" +
    "        \n" +
    "        <!-- ADD WORKSPACE -->\n" +
    "        <div class=\"zm-p-2 zm-flex-minimal\">\n" +
    "            <zm-btn class=\"zm-w100 zm-btn-primary\" ng-click=\"connect(undefined, onAddConnection)\">\n" +
    "                <i class=\"fa fa-link fa-margin-right\"></i>\n" +
    "                {{ ::t('core.components.sidebar.workspace.btnAddNewWorkspace') }}\n" +
    "            </zm-btn>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('modules/doc/doc.html',
    "<div class=\"zm-doc zm-clearfix\">\n" +
    "	<div class=\"zm-doc-inner\" ng-if=\"modal.visible\">\n" +
    "		<iframe ng-src=\"{{ getUrl() }}\"></iframe>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/easteregg/easteregg.help.html',
    "<h1>EasterEgg</h1>\n" +
    "<p>This module hides a little secret inside the Layout Engine. Will you find it? :-)</p>"
  );


  $templateCache.put('modules/easteregg/easteregg.html',
    "<div class=\"zm-easteregg\">\n" +
    "    <iframe id=\"ytplayer\" src=\"//www.youtube.com/embed/Mi9viiHSmu4?mode=opaque&amp;rel=0&amp;autoplay=1&amp;autohide=1&amp;showinfo=0&amp;wmode=transparent\" frameborder=\"0\"/>\n" +
    "</div>"
  );


  $templateCache.put('modules/code/code.edit.html',
    "<div class=\"zm-widget-code-edit\">\n" +
    "    \n" +
    "    <!-- TABS -->\n" +
    "	<ul class=\"zm-tabs\">\n" +
    "		<li class=\"zm-tab-item\" ng-click=\"tabs.set(item.key)\" ng-class=\"{ active: tabs.current === item.key }\" ng-repeat=\"item in tabs.items\">{{ ::item.title }}</li>\n" +
    "	</ul>\n" +
    "	\n" +
    "	<!-- CODE EDITORS -->\n" +
    "	<zm-field-code ng-show=\"item.key === tabs.current\" mode=\"item.key\" ng-model=\"editors[item.key]\" ng-repeat=\"item in tabs.items | filter: { editor: true }\" />\n" +
    "	\n" +
    "	<div ng-if=\"tabs.current === 'preview'\" class=\"zm-widget-code-edit-preview\">\n" +
    "	    <style scoped ng-bind-html=\"::(css | trustHtml)\"></style>\n" +
    "	    <script ng-bind-html=\"::(js | trustHtml)\"></script>\n" +
    "	    <div ng-bind-html=\"::(html | trustHtml)\"></div>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('modules/code/code.html',
    "<div class=\"zm-widget-code\">\n" +
    "    MY CODE\n" +
    "</div>"
  );


  $templateCache.put('modules/partial/partial.html',
    "<div class=\"zm-widget-partial\">\n" +
    "    MY PARTIAL\n" +
    "</div>"
  );


  $templateCache.put('modules/segment/segment.html',
    "<div class=\"zm-widget-segment\">\n" +
    "    MY SEGMENT\n" +
    "</div>"
  );


  $templateCache.put('modules/debug/debug.sidebar.html',
    "<div class=\"zm-sidebar-debug zm-flex-container-column zm-h100\">\n" +
    "	\n" +
    "	<div class=\"zm-flex-minimal\">\n" +
    "		\n" +
    "	</div>\n" +
    "	<div class=\"zm-scrollable-y zm-flex-container-column\">\n" +
    "		\n" +
    "		<!-- DETAILS -->\n" +
    "		<zm-accordion ng-model=\"settings.details.visible\" style=\"margin-top: -1px\">\n" +
    "			<header class=\"zm-flex-container zm-flex-gap zm-flex-align-center\">\n" +
    "				<span class=\"zm-sidebar-title-text\">\n" +
    "					{{ ::t('core.components.sidebar.debug.detailsTitle') }}\n" +
    "				</span>\n" +
    "				\n" +
    "				<i class=\"fa zm-flex-minimal\" ng-class=\"{'fa-chevron-down': settings.details.visible, 'fa-chevron-right': !settings.details.visible}\"></i>\n" +
    "			</header>\n" +
    "			<content class=\"zm-p-3\">\n" +
    "				<div class=\"zm-flex-container zm-nowrap\">\n" +
    "					<div>\n" +
    "						<strong>{{ ::t('core.components.sidebar.debug.version') }}</strong> {{ version }}\n" +
    "					</div>\n" +
    "					<div>\n" +
    "						<strong>{{ ::t('core.components.sidebar.debug.selectedWidgets') }}</strong> {{ zm.widget.totalSelected }}\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				<div class=\"zm-flex-container zm-nowrap\">\n" +
    "					<div>\n" +
    "						<strong>{{ ::t('core.components.sidebar.debug.totalWidgets') }}</strong> {{ $segment.segment.getTotalWidgets() }}\n" +
    "					</div>\n" +
    "					<div>\n" +
    "						<strong>{{ ::t('core.components.sidebar.debug.history') }}</strong> {{ history.position || 0 }} / {{ history.changes.length || 0 }}\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</content>\n" +
    "		</zm-accordion>\n" +
    "		\n" +
    "		<!-- SETTINGS -->\n" +
    "		<zm-accordion ng-model=\"settings.settings.visible\">\n" +
    "			<header class=\"zm-flex-container zm-flex-gap zm-flex-align-center\">\n" +
    "				<span class=\"zm-sidebar-title-text\">\n" +
    "					{{ ::t('core.components.sidebar.debug.settingsTitle') }}\n" +
    "				</span>\n" +
    "				\n" +
    "				<i class=\"fa zm-flex-minimal\" ng-class=\"{'fa-chevron-down': settings.settings.visible, 'fa-chevron-right': !settings.settings.visible}\"></i>\n" +
    "			</header>\n" +
    "			<content class=\"zm-p-2\">\n" +
    "				<zm-field-switch title=\"{{ ::t('core.components.sidebar.debug.settings.showWidgetTokenId') }}\" ng-model=\"$settings.debug.settings.showWidgetTokenId\"></zm-field-switch>\n" +
    "			</content>\n" +
    "		</zm-accordion>\n" +
    "		\n" +
    "		<!-- LOGS -->\n" +
    "		<zm-accordion ng-model=\"settings.logs.visible\">\n" +
    "			<header class=\"zm-flex-container zm-flex-gap zm-flex-align-center\">\n" +
    "				<span class=\"zm-sidebar-title-text\">\n" +
    "					{{ ::t('core.components.sidebar.debug.logsTitle') }}\n" +
    "				</span>\n" +
    "				\n" +
    "				<i class=\"fa zm-flex-minimal\" ng-class=\"{'fa-chevron-down': settings.logs.visible, 'fa-chevron-right': !settings.logs.visible}\"></i>\n" +
    "			</header>\n" +
    "			<content>\n" +
    "				<div class=\"zm-pt-1\" ng-init=\"groups = ($debug.getActiveNamespaces() | columnize: 2)\">\n" +
    "					<div ng-repeat=\"group in groups\" class=\"zm-flex-container zm-flex-gap zm-flex-equal-size zm-flex-align-center\">\n" +
    "						<div ng-repeat=\"item in group\" class=\"zm-px-1\">\n" +
    "							<zm-field-switch title=\"{{ item.label }}\" ng-model=\"item.active\"></zm-field-switch>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				\n" +
    "				<ul class=\"zm-sidebar-debug-console zm-m-2 zm-shadow-down-inset\">\n" +
    "					<li class=\"zm-sidebar-debug-console-empty zm-text-center zm-m-3\" ng-if=\"$debug.recent.length === 0\">\n" +
    "						{{ ::t('core.components.sidebar.debug.logsEmpty') }}\n" +
    "					</li>\n" +
    "					<li class=\"zm-sidebar-debug-item zm-px-2\" ng-repeat=\"log in $debug.recent\">\n" +
    "						<span class=\"zm-sidebar-debug-console-date\">{{ log.datetime | date:'YYYY-MM-DD HH:mm:ss:ms' }}</span>\n" +
    "						<span class=\"zm-sidebar-debug-console-namespace zm-px-2\">{{ log.namespace }}</span>\n" +
    "						<span class=\"zm-sidebar-debug-console-name zm-px-2\">{{ log.name }}</span>\n" +
    "						<span class=\"zm-sidebar-debug-console-value\">{{ log.value.toString() }}</span>\n" +
    "					</li>\n" +
    "				</ul>\n" +
    "				\n" +
    "				<div class=\"zm-p-2 zm-pt-0 zm-sidebar-debug-console-options zm-flex-container zm-flex-align-center zm-flex-equal-height\">\n" +
    "					<div class=\"zm-flex-minimal\">\n" +
    "						{{ ::t('core.components.sidebar.debug.maxLogs') }}\n" +
    "					</div>\n" +
    "					<div style=\"min-width: 8rem\">\n" +
    "						<zm-field-number ng-model=\"$settings.debug.settings.maxLog\"></zm-field-number>\n" +
    "					</div>\n" +
    "					<div class=\"zm-flex-align-self-stretch\">\n" +
    "						<zm-btn ng-disabled=\"$debug.recent.length === 0\" class=\"zm-w100 zm-h100\" ng-click=\"$debug.clearLogs()\">\n" +
    "							{{ ::t('core.components.sidebar.debug.clearConsole') }}\n" +
    "						</zm-btn>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</content>\n" +
    "		</zm-accordion>\n" +
    "	\n" +
    "		<!-- ACTIONS -->\n" +
    "		<zm-accordion ng-model=\"settings.actions.visible\">\n" +
    "			<header class=\"zm-flex-container zm-flex-gap zm-flex-align-center\">\n" +
    "				<span class=\"zm-sidebar-title-text\">\n" +
    "					{{ ::t('core.components.sidebar.debug.actionsTitle') }}\n" +
    "				</span>\n" +
    "				\n" +
    "				<i class=\"fa zm-flex-minimal\" ng-class=\"{'fa-chevron-down': settings.actions.visible, 'fa-chevron-right': !settings.actions.visible}\"></i>\n" +
    "			</header>\n" +
    "			<content>\n" +
    "				<!-- NOTICE -->\n" +
    "				<zm-dismissable locked type=\"warning\" key=\"zm-sidebar-debug-intro\">\n" +
    "					<span ng-bind-html=\"::t('core.components.sidebar.debug.actionsWarning') | trustHtml\"></span>\n" +
    "				</zm-dismissable>\n" +
    "				\n" +
    "				<!-- ACTIONS -->\n" +
    "				<div class=\"zm-p-2\">\n" +
    "					<zm-btn class=\"zm-w100\" ng-class=\"{ 'zm-mt-1': $index > 0, 'zm-btn-warning': action.warning }\" ng-click=\"action.callback()\" ng-repeat=\"action in $debug.actions\">\n" +
    "						{{ ::action.title }}\n" +
    "					</zm-btn>\n" +
    "				</div>\n" +
    "			</content>\n" +
    "		</zm-accordion>\n" +
    "	</div>\n" +
    "	<div class=\"zm-flex-minimal\">\n" +
    "		\n" +
    "	</div>\n" +
    "</div>"
  );

}]);

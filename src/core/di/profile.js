/**
 * Zemit Profile
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.factory('$profile', ['$hook', '$debug', '$i18n', '$rootScope', '$modal', '$sessionWorkspace', function($hook, $debug, $i18n, $rs, $modal, $sessionWorkspace) {
		
		$hook.add('onReady', () => {
			$debug.init('profile', $i18n.get('core.di.profile.debugTitle'));
			$debug.addAction(
				$i18n.get('core.di.profile.debugActionSaveStateTitle'),
				factory.saveState
			);
			$debug.addAction(
				$i18n.get('core.di.profile.debugActionLoadAllDataTitle'),
				factory.loadAllData
			);
			factory.init();
		}, undefined, 5);
		
		$hook.add('onNewHistory', () => {
			factory.isLoading = false;
			factory.hasLoaded = false;
			factory.isSaving = false;
			factory.hasSaved = false;
		});
		
		$hook.add('onStorageSet', (table, model) => {
			factory.saveData(table + '.' + model.getKey() + '.json', model.getData());
			$rs.$digest();
		});
		
		var factory = {
			
			hasProviders: null,
			isLoaded: null,
			isSignedIn: null,
			isLoading: false,
			hasLoaded: false,
			isSaving: false,
			hasSaved: false,
			providers: [],
			currentProvider: null,
			
			givenName: null,
			displayName: null,
			picture: null,
			
			addProvider: function(name, props) {
				this.providers.push({
					name: name,
					props: props
				});
			},
			
			init: function() {
				
				if(this.providers.length === 0) {
					this.isLoaded = true;
				}
				else {
					
					let providerLoaded = 0;
					this.providers.forEach(provider => {
						if(provider.props.onInit instanceof Function) {
							provider.props.onInit().then(isSignedIn => {
								
								providerLoaded++;
								if(providerLoaded === this.providers.length) {
									factory.isLoaded = true;
									factory.currentProvider = provider;
									
									if(provider.props.onConnect instanceof Function) {
										provider.props.onConnect().then(factory.onConnect);
									}
								}
								
								$debug.log('profile', 'INIT', provider);
								$rs.$digest();
							});
						}
					});
				}
				
				this.hasProviders = this.providers.length > 0;
			},
			
			onConnect: function(isSignedIn) {
				
				factory.isSignedIn = isSignedIn;
				
				if(isSignedIn) {
					factory.loadProfile();
					// factory.loadAllData();
				}
				
				$debug.log('profile', 'CONNECT', factory.currentProvider);
				$rs.$digest();
			},
			
			clearProfile: function() {
				
				angular.extend(this, {
					givenName: null,
					displayName: null,
					picture: null
				});
				
				$debug.log('profile', 'CLEAR PROFILE');
			},
			
			loadProfile: function() {
				
				if(factory.isSignedIn && factory.currentProvider.props.onGetProfile instanceof Function) {
					factory.currentProvider.props.onGetProfile().then(profile => {
						
						angular.extend(factory, profile);
						$debug.log('profile', 'LOAD PROFILE', profile);
						$rs.$digest();
					});
				}
			},
			
			loadAllData: () => {
				
				if(factory.isSignedIn && factory.currentProvider.props.onLoadData instanceof Function) {
					
					this.isLoading = true;
					this.hasLoaded = false;
					
					let segmentKeyFilename = 'session.segment.json';
					factory.currentProvider.props.onLoadData(segmentKeyFilename).then(response => {
						
						$debug.log('profile', 'PROFILE LOAD DATA', {
							filename: segmentKeyFilename,
							data: response,
							provider: factory.currentProvider
						});
						
						let segmentFilename = 'segment.' + response + '.json';
						factory.currentProvider.props.onLoadData(segmentFilename).then(response => {
							
							$debug.log('profile', 'PROFILE LOAD DATA', {
								filename: segmentFilename,
								data: response,
								provider: factory.currentProvider
							});
							
							$sessionWorkspace.setContent(response.content);
							
							factory.isLoading = false;
							factory.hasLoaded = true;
							
							$rs.$digest();
						});
					});
				}
			},
			
			saveData: (filename, data) => {
							
				this.isSaving = true;
				this.hasSaved = false;
				
				if(factory.isSignedIn && factory.currentProvider.props.onSave instanceof Function) {
					factory.currentProvider.props.onSave(filename, data).then(response => {
							
						factory.isSaving = false;
						factory.hasSaved = true;
						
						$debug.log('profile', 'PROFILE SAVE DATA', {
							filename: filename,
							data: data,
							provider: factory.currentProvider
						});
						$rs.$digest();
					});
				}
			},
			
			signIn: function() {
				
				if(!factory.isSignedIn && factory.currentProvider.props.onSignIn instanceof Function) {
					factory.currentProvider.props.onSignIn().then(response => {
						
						factory.isSignedIn = true;
						
						$debug.log('profile', 'SIGNED IN', factory.currentProvider);
						$rs.$digest();
					});
				}
			},
			
			signOut: function() {
				
				$modal.dialog('profileSignOut', {
					backdrop: true,
					title: $i18n.get('core.di.profile.modalSignOutTitle'),
					content: $i18n.get('core.di.profile.modalSignOutContent'),
					buttons: [{
						label: $i18n.get('core.di.profile.modalSignOutBtnConfirm'),
						warning: true,
						callback: (event, modal) => {
							
							if(factory.isSignedIn && factory.currentProvider.props.onSignOut instanceof Function) {
								factory.currentProvider.props.onSignOut().then(response => {
									
									factory.isSignedIn = false;
									
									$debug.log('profile', 'SIGNED OUT', factory.currentProvider);
									$rs.$digest();
								});
							}
							
							modal.close();
						}
					}, {
						label: $i18n.get('core.di.modal.btnCancel'),
						default: true
					}, ]
				});
			}
		};
		
		return factory;
	}]);
})();
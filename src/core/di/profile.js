/**
 * Zemit Profile
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.factory('$profile', ['$hook', '$debug', '$i18n', '$rootScope', function($hook, $debug, $i18n, $rs) {
		
		$hook.add('onReady', () => {
			$debug.init('profile', $i18n.get('core.di.profile.debugTitle'));
			factory.init();
		}, undefined, 5);
		
		$hook.add('onStorageSet', (table, model) => {
			factory.saveData(table + '.' + model.getKey() + '.json', model.getData());
		});
		
		var factory = {
			
			hasProviders: null,
			isLoaded: null,
			isSignedIn: null,
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
					this.providers.forEach(provider => {
						if(provider.props.onInit instanceof Function) {
							provider.props.onInit().then(response => {
								
								factory.currentProvider = provider;
								factory.isLoaded = true;
								$debug.log('profile', 'INIT', provider);
								$rs.$digest();
							});
						}
					});
				}
				
				this.hasProviders = this.providers.length > 0;
			},
			
			connect: function() {
				
				if(factory.currentProvider.props.onConnect instanceof Function) {
					factory.currentProvider.props.onConnect().then(response => {
						
						$debug.log('profile', 'CONNECT', factory.currentProvider);
						$rs.$digest();
					});
				}
			},
			
			clearProfile: function() {
				
				angular.extend(this, {
					givenName: null,
					displayName: null,
					picture: null
				});
				
				this.isSignedIn = false;
				
				$debug.log('profile', 'CLEAR PROFILE');
			},
			
			loadProfile: function(profile = {}) {
				
				angular.extend(this, profile);
				
				this.isSignedIn = true;
				
				$debug.log('profile', 'LOAD PROFILE', profile);
			},
			
			loadData: () => {
				
			},
			
			saveData: (filename, data) => {
				
				if(factory.currentProvider.props.onSave instanceof Function) {
					factory.currentProvider.props.onSave(filename, data).then(response => {
						
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
				
				if(factory.currentProvider.props.onSignIn instanceof Function) {
					factory.currentProvider.props.onSignIn().then(response => {
						
						factory.isSignedIn = true;
						
						$debug.log('profile', 'SIGNED IN', factory.currentProvider);
						$rs.$digest();
					});
				}
			},
			
			signOut: function() {
				
				if(factory.currentProvider.props.onSignOut instanceof Function) {
					factory.currentProvider.props.onSignOut().then(response => {
						
						factory.isSignedIn = false;
						
						$debug.log('profile', 'SIGNED OUT', factory.currentProvider);
						$rs.$digest();
					});
				}
			}
		};
		
		return factory;
	}]);
})();
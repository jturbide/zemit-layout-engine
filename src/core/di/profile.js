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
		
		var factory = {
			
			hasProviders: null,
			isLoaded: null,
			isSignedIn: null,
			providers: [],
			
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
				
				this.providers.forEach(provider => {
					if(provider.props.onConnect instanceof Function) {
						provider.props.onConnect().then(response => {
							
							$debug.log('profile', 'CONNECT', provider);
							$rs.$digest();
						});
					}
				});
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
			
			saveData: (fileName, data) => {
				
			},
			
			signIn: function() {
				
				this.providers.forEach(provider => {
					if(provider.props.onSignIn instanceof Function) {
						provider.props.onSignIn().then(response => {
							
							factory.isSignedIn = true;
							
							$debug.log('profile', 'SIGNED IN', provider);
							$rs.$digest();
						});
					}
				});
			},
			
			signOut: function() {
				
				this.providers.forEach(provider => {
					if(provider.props.onSignOut instanceof Function) {
						provider.props.onSignOut().then(response => {
							
							factory.isSignedIn = false;
							
							$debug.log('profile', 'SIGNED OUT', provider);
							$rs.$digest();
						});
					}
				});
			}
		};
		
		return factory;
	}]);
})();
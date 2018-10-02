/**
 * Zemit Profile
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.factory('$profile', ['$hook', function($hook) {
	    
	    $hook.add('onReady', () => {
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
							provider.props.onInit();
						}
					});
				}
				
				this.hasProviders = this.providers.length > 0;
			},
			
			connect: function() {
				
				this.providers.forEach(provider => {
					if(provider.props.onConnect instanceof Function) {
						provider.props.onConnect();
					}
				});
			},
			
			loadData: () => {
				
			},
			
			saveData: (fileName, data) => {
				
			},
			
			signIn: function() {
				
				this.providers.forEach(provider => {
					if(provider.props.onSignIn instanceof Function) {
						provider.props.onSignIn();
					}
				});
			}
		};
		
		return factory;
	}]);
})();
/**
 * Zemit Device
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.factory('$device', [function() {
		
		var factory = {
			
			_isTouch: null,
			_isPrecise: null,
			_isSupported: null,
			_browser: null,
			_supportsGrid: null,
			_supportsFlexbox: null,
			
			supportedVersion: {
				edge: 16,
				chrome: 57,
				firefox: 52,
				opera: 44,
				safari: 11
			},
			
			vibrate: function(delay = 100) {
				
				console.log('VIBRATE', delay);
				
				if(navigator.vibrate) {
					navigator.vibrate(delay);
				}
			},
			
			isLargeEnough: function() {
				return window.innerWidth > 991;
			},
			
			isTouch: function() {
				return window.matchMedia('(pointer: coarse)').matches;
			},
			
			isPrecise: function() {
				return window.matchMedia('(pointer: fine)').matches;
			},
			
			isStandalone: function() {
				return window.matchMedia('(display-mode: standalone)').matches
					|| window.navigator.standalone
					|| window.location.search.indexOf('standalone=1') !== -1;
			},
			
			/**
			 * https://stackoverflow.com/a/38080051/538323
			 */
			getBrowser: function() {
				
				var ua = navigator.userAgent,
					tem,
					M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
				if (/trident/i.test(M[1])) {
					tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
					return { name: 'ie', version: (tem[1] || '') };
				}
				if (M[1] === 'Chrome') {
					tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
					if (tem != null) return { name: tem[1].replace('OPR', 'opera').toLowerCase(), version: tem[2] };
				}
				M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
				if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
				return {
					name: M[0].toLowerCase(),
					version: M[1].toLowerCase()
				};
				
				return {
					name: 'unknown',
					version: 0
				};
			},
			
			isSupported: function() {
				
				var browser = this.getBrowser();
				
				switch(browser.name) {
					case 'edge': return browser.version >= this.supportedVersion.edge;
					case 'chrome': return browser.version >= this.supportedVersion.chrome;
					case 'firefox': return browser.version >= this.supportedVersion.firefox;
					case 'opera': return browser.version >= this.supportedVersion.opera;
					case 'safari': return browser.version >= this.supportedVersion.safari;
				}
				
				return false;
			},
			
			supportsGrid: () => {
				var el = document.createElement('div');
				return typeof el.style.grid === 'string';
			},
			
			supportsFlexbox: () => {
				var el = document.createElement('div');
				el.style.display = 'flex';
				return typeof el.style.display === 'flex';
			}
		};
		
		factory._isTouch = factory.isTouch();
		factory._isPrecise = factory.isPrecise();
		factory._isSupported = factory.isSupported();
		factory._browser = factory.getBrowser();
		factory._supportsGrid = factory.supportsGrid();
		factory._supportsFlexbox = factory.supportsFlexbox();
		
		return factory;
	}]);
})();
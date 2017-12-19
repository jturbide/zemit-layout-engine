/**
 * Zemit Device
 * @author: <contact@dannycoulombe.com>
 */
(function() {
	Zemit.app.factory('$device', [function() {
		
		var factory = {
			
			_isTouch: null,
			_isPrecise: null,
			
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
			
			getBrowser: function() {
				
				if((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
					return 'opera';
				}
				if(typeof InstallTrigger !== 'undefined') {
					return 'firefox';
				}
				if(/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) {
					return 'safari';
				}
				if(/*@cc_on!@*/false || !!document.documentMode) {
					return 'ie';
				}
				else if(!!window.StyleMedia) {
					return 'edge';
				}
				if(!!window.chrome && !!window.chrome.webstore) {
					return 'chrome';
				}
				if('WebkitAppearance' in document.documentElement.style) {
					return 'webkit';
				}
				
				return 'unknown';
			},
			
			isSupportedDevice: function() {
				
				switch(this.getBrowser()) {
					case 'chrome':		// Version 57+
					case 'firefox': 	// Version 52+
					case 'opera':		// Version 44+
					case 'safari':		// Version 11+
					case 'webkit':
						return true;
				}
				
				return false;
			}
		};
		
		factory._isTouch = factory.isTouch();
		factory._isPrecise = factory.isPrecise();
		factory._isSupportedDevice = factory.isSupportedDevice();
		factory._browser = factory.getBrowser();
		
		return factory;
	}]);
})();
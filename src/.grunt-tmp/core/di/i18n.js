/**
 * Zemit Internationalization
 * @author: <contact@dannycoulombe.com>
 * 
 * Print and update app's language.
 */
(function() {
	Zemit.app.factory('$i18n', ['$q', '$http', '$util', '$device', function($q, $http, $util, $device) {
		
		var factory = {
			
			data: {
				'en_CA': {},
				'fr_CA': {}
			},
			
			language: 'en_CA',
			
			init: function() {
				
				return new Promise((resolve, reject) => {
					
					let lang = navigator.language.substring(0, 5);
				
					if(this.data[lang]) {
						this.language = lang;
					}
					else {
						lang = this.language;
					}
					
					resolve();
				});
			},
			
			setLang: function(lang) {
				
				if(!this.data[lang]) {
					lang = Object.keys(this.data)[0];
				}
				
				this.language = lang;
			},
			
			load: function(lang, data = {}) {
				
				var literals = {};
				literals[lang] = data;
				angular.merge(this.data, literals);
			},
			
			get: function(key, params = {}, lang = factory.language) {
				
				if(!factory.data[lang]) {
					return key;
				}
				
				let dig = function(cat, keys, key) {
					
					if(!cat[keys[0]]) {
						console.warn('LABEL_NOT_FOUND', key);
						return key;
					}
					
					cat = cat[keys[0]];
					keys.splice(0, 1);
					
					if(keys.length > 0) {
						return dig(cat, keys, key);
					}
					
					return cat;
				};
				
				let cat = factory.data[lang];
				let keys = key.split('.');
				let label = dig(cat, keys, key);
				
				// Apply params to label
				let paramKeys = Object.keys(params);
				paramKeys.forEach((key) => {
					label = label.replace(':' + key + ':', params[key]);
				});
				
				return label;
			}
		};
		
		let langParam = $util.getUrlParam('lang');
		if(langParam) {
			factory.setLang(langParam);
		}
		else {
			factory.setLang($device.getBestLang());
		}
		
		return factory;
	}]);
})();
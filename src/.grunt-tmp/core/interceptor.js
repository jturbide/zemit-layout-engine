Zemit.app.factory('$httpInterceptor', ['$q', '$hook', function($q, $hook) {

	let interceptor = {
		
		totalQueries: 0,
		
		'request': function(config) {
			
			this.totalQueries++;
			
			$hook.run('onHttpRequest', config);
			
			return config;
		},
		'response': function(response) {
			
			this.totalQueries--;
			
			$hook.run('onHttpResponse', response);
			
			return response;
		},
		'requestError': function(response) {

			this.totalQueries--;
			
			$hook.run('onRequestError', response);

			return $q.reject(response);
		},
		'responseError': function(response) {
			
			this.totalQueries--;
			
			$hook.run('onResponseError', response);
			
			return $q.reject(response);
		}
	};
	
	return interceptor;
}]);

Zemit.app.config(function($httpProvider) {
	$httpProvider.interceptors.push('$httpInterceptor');
});
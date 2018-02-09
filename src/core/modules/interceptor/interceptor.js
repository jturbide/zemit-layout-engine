Zemit.app.factory('httpInterceptor', ['$q', '$hook', function($q, $hook) {

	var loading = 0;
	var interceptor = {
		'request': function(config) {
			
			loading--;
			
			$hook.run('onHttpRequest', config);
			
			return config;
		},
		'response': function(response) {
			
			loading--;
			
			$hook.run('onHttpResponse', response);
			
			return response;
		},
		'requestError': function(response) {

			loading--;
			
			$hook.run('onRequestError', response);

			return $q.reject(response);
		},
		'responseError': function(response) {
			
			loading--;
			
			$hook.run('onResponseError', response);
			
			return $q.reject(response);
		}
	};
	return interceptor;
}]);

Zemit.app.config(function($httpProvider) {
	$httpProvider.interceptors.push('httpInterceptor');
});
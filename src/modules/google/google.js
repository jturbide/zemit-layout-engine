/**
 * Zemit Google connector
 * @author: <contact@dannycoulombe.com>
 * Creation date: 2018-10-02
 */
(function() {
	Zemit.module('google', ['$rootScope', '$profile', function($rs, $profile) {
		return {
			
			priority: 0,
			group: 'serviceProvider',
			
			factories: {
				$google: [function() {
					
					let factory = {
						
						_clientId: '261375955062-oo0ji60ngln7ht9p8pi32rn4ksu7ltp6.apps.googleusercontent.com',
						
						init: (clientId, callback) => {
							
							gapi.client.init({
								clientId: clientId,
								discoveryDocs: [
									"https://people.googleapis.com/$discovery/rest",
									"https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
								],
								scope: [
									'profile',
									'https://www.googleapis.com/auth/drive.appdata',
									'https://www.googleapis.com/auth/drive.file'
								].join(' ')
							}).then(() => {
								
								gapi.auth2.getAuthInstance().isSignedIn.listen(function(isSignedIn) {
									factory.updateSigninStatus(isSignedIn);
								});
								factory.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
								
								if(callback instanceof Function) {
									callback(factory.isSignedIn);
								}
							});
						},
						
						handleClientLoad(callback) {
							
							gapi.load('client:auth2', () => this.init(
								this._clientId,
								callback
							));
						},
						
						handleSignInClick(event) {
							
							return gapi.auth2.getAuthInstance().signIn();
						},
						
						handleSignOutClick(event) {
							
							return gapi.auth2.getAuthInstance().signOut();
						},
						
						updateSigninStatus: function(isSignedIn) {
							
							if(isSignedIn) {
								
								this.listFiles().then(files => {
									console.log('GOOGLE FILES', files);
								});
								
								this.getProfile().then(profile => {
									
									$profile.loadProfile({
										givenName: profile.person.givenName,
										displayName: profile.person.displayName,
										picture: profile.picture.url
									});
									
									$rs.$digest();
								});
							}
							else {
								$profile.clearProfile();
							}
							
							$rs.$digest();
						},
						
						getProfile: () => {
							
							return new Promise((success, error) => {
								gapi.client.people.people.get({
									'resourceName': 'people/me',
									'requestMask.includeField': 'person.names,person.photos'
								}).then(response => {
									success({
										person: response.result.names[0],
										picture: response.result.photos[0]
									});
								});
							});
						},
						
						listFiles: () => {
							
							return new Promise((success, error) => {
								gapi.client.drive.files.list({
									spaces: 'appDataFolder',
									fields: 'files(id, name)'
								}).then(function(response) {
									success(response.result.files);
								}, error);
							});
						},
						
						createFile: (name) => {
							
							return new Promise((success, error) => {
								gapi.client.drive.files.create({
									fields: 'id',
									resource: {
										name: name,
										parents: ['appDataFolder']
									}
								}).then(function(response) {
									success(response.result.id || null);
								}, error);
							});
						},
						
						/**
						 * Mostly for debugging purposes..
						 */
						cleanUntitledFiles: () => {
							
							this.listFiles().then(files => {
								files.forEach(file => {
									if(file.name === 'Untitled') {
										factory.deleteFile(file.id);
									}
								});
							});
						},
						
						deleteFile: (fileId) => {
							
							return gapi.client.drive.files.delete({
								'fileId': fileId
							});
						},
						
						getFileId: (name) => {
							
							return new Promise((success, error) => {
								gapi.client.drive.files.list({
									q: 'name="' + name + '"',
									spaces: 'appDataFolder',
									fields: 'files(id)'
								}).then(function(response) {
									
									if(response.result.files.length > 0) {
										return success(response.result.files[0].id);
									}
									
									return success(factory.createFile());
								}, error);
							});
						},
						
						readFile: (name) => {
							
							return new Promise((success, error) => {
								factory.getFileId(name).then(fileId => {
									gapi.client.drive.files.get({
										fileId: fileId,
										alt: 'media'
									}).then(function(response) {
										success(response.result || null);
									}, error);
								});
							});
						},
						
						saveFile: (name, body = {}) => {
							
							return gapi.client.load('drive', 'v3').then(() => {
								return factory.getFileId(name).then(fileId => {
									return gapi.client.request({
										path: '/upload/drive/v3/files/' + fileId,
										method: 'PATCH',
										params: {
											uploadType: 'media'
										},
										body: JSON.stringify(body)
									});
								});
							});
						}
					};
					
					return factory;
				}]
			},
			
			onInit: ($injector) => {
					
				let $google = $injector.get('$google');
				
				$profile.addProvider('google', {
					onSignIn: () => {
						return $google.handleSignInClick();
					},
					onSignOut: () => {
						return $google.handleSignOutClick();
					},
					onInit: () => {
						
						return new Promise((success, error) => {
							
							let tag = document.createElement('script');
							tag.src = 'https://apis.google.com/js/api.js';
							tag.setAttribute('async', true);
							tag.setAttribute('defer', true);
							tag.onreadystatechange = () => {
								
								if(this.readyState === 'complete') {
									this.onload();
								}
							};
							tag.onload = () => {
								
								tag.onload = function() {};
								$google.handleClientLoad(success);
							};
							
							document.head.appendChild(tag);
						});
					},
					onConnect: () => {
						
					},
					onSave: (filename, data) => {
						return $google.saveFile(filename, data);
					}
				});
			}
		};
	}]);
})();
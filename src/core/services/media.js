/**
 * Zemit Medias
 * @author: <contact@dannycoulombe.com>
 * 
 * Get and set medias
 */
(function() {
	
	Zemit.app.run(['$storage', function($storage) {
		
		// Prepare storage store
		$storage.defineStore('media');
	}]);
	
	Zemit.app.factory('$media', ['$storage', '$file', '$i18n', function($storage, $file, $i18n) {
		
		var factory = {
			
			add: (file) => {
				
				return new Promise((resolve, reject) => {
					
					$file.getChecksum(file).then((checksum) => {
						
						var media = new Media(checksum, file);
						media.prepare().then(() => {
							$storage.set('media', checksum, media.dump()).then(() => {
								resolve(media);
							}).catch(reject);
						});
					});
				});
			},
			
			get: (id) => {
				
				return new Media(id).load();
			},
			
			getAll: () => {
				
				return new Promise((resolve, reject) => {
					$storage.getAll('media').then((list) => {
						
						var medias = [];
						angular.forEach(list, (structure) => {
							var media = new Media();
							media.structure = structure;
							medias.push(media);
						});
						
						resolve(medias);
						
					}).catch(reject);
				});
			}
		};
		
		
		var Media = function(id = null, file = null) {
			
			var media = this;
			
			this.structure = {
				id: id,
				file: file
			};
			
			this.getId = () => {
				return this.structure.id;
			};
			
			this.getFile = () => {
				return this.structure.file;
			};
			
			this.dump = () => {
				return this.structure;
			};
			
			this.prepare = () => {
				
				if(this.isImage()) {
					
					this.structure.sizes = {};
					this.dimension = {};
					this.breakpoints = {
						thumbnail: 480,
						small: 768,
						medium: 1280,
						large: 1920,
						retina: 2660
					};
					
					this.resize = (name, width, height, mimeType = 'image/jpeg', quality = 0.75) => {
						
						return new Promise((resolve, reject) => {
							
							var img = new Image();
							img.onload = () => {
								
								this.structure.dimension = {
									width: img.width,
									height: img.height
								};
								
								// If only one size orientation provided, adjust with ratio
								var ratio = img.width / img.height;
								if(width && !height) {
									height = width / ratio;
								}
								else if(!width && height) {
									width = height * ratio;
								}
								else {
									reject(new ZmError(406, $i18n.get('core.services.media.errResizeNoWidthHeight')));
								}
								
								var canvas = document.createElement('canvas');
								canvas.width = width;
								canvas.height = height;
								
								var ctx = canvas.getContext('2d');
							
								// set size proportional to image
								canvas.height = canvas.width * (img.height / img.width);
								
								// step 1 - resize to 50%
								var oc = document.createElement('canvas'),
									octx = oc.getContext('2d');
							
								oc.width = img.width * 0.5;
								oc.height = img.height * 0.5;
								ctx.fillStyle = 'white';
								ctx.fillRect(0, 0, canvas.width, canvas.height);
								octx.drawImage(img, 0, 0, oc.width, oc.height);
								
								// step 2
								octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
							
								// step 3, resize to final size
								ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5, 0, 0, canvas.width, canvas.height);
								
								canvas.toBlob(function(blob) {
									media.structure.sizes[name] = {
										data: blob,
										info: {
											mimeType: mimeType,
											quality: quality,
											dimension: {
												width: width,
												height: height
											}
										}
									};
									resolve(media.structure.sizes[name]);
								}, mimeType, quality);
							};
							img.onerror = reject;
							
							$file.toBase64(this.getFile()).then((event) => {
								img.src = event.target.result;
							});
						});
					};
				}
				
				return new Promise((resolve, reject) => {
					if(this.isImage()) {
						var promises = [];
						angular.forEach(this.breakpoints, (size, name) => {
							if(!this.structure.sizes[name]) {
								promises.push(this.resize(name, size));
							}
						})
						Promise.all(promises).then(() => resolve(media));
					}
					else {
						resolve();
					}
				});
			}
			
			this.load = () => {
				
				return new Promise((resolve, reject) => {
					$storage.get('media', id).then((structure) => {
						media.structure = structure;
						media.prepare().then(() => resolve(media));
					}).catch(reject);
				});
			};
			
			this.isImage = () => {
				return this.getFile() && this.getFile().type.startsWith('image/');
			};
			
			return this;
		};
		
		return factory;
	}]);
})();
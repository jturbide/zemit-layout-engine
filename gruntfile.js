module.exports = function(grunt) {
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		assets_inline: {
			all: {
				options: {
					inlineImg: true,
					inlineLinkTags: true,
					inlineSvg: true,
					inlineSvgBase64: true,
					assetsUrlPrefix: 'assets/img/'
				},
				files: {
					'src/.grunt-tmp/components/sidebar/sidebar.html': 'src/.grunt-tmp/components/sidebar/sidebar.html',
				}
			}
		},
		
		ngtemplates: {
			zemit: {
				cwd: 'src/.grunt-tmp',
				src: ['components/**/*.html', 'directives/**/*.html'],
				dest: 'src/.grunt-tmp/templates.js'
			}
		},
		
		includeSource: {
			options: {
				basePath: 'src/.grunt-tmp',
				baseUrl: '',
				ordering: 'top-down'
			},
			app: {
				files: {
					'src/.grunt-tmp/index.html': 'src/.grunt-tmp/index.html'
				}
			}
		},
		
		useminPrepare: {
			html: 'src/.grunt-tmp/index.html'
		},
 
		usemin: {
			html: ['src/.grunt-tmp/index.html']
		},
 
		uglify: {
			options: {
				report: 'min',
				mangle: false
			},
			target: {
				files: [{
					expand: true,
					cwd: 'src/.grunt-tmp',
					src: '**/*.js',
					dest: 'src/.grunt-tmp/'
				}]
			}
		},
		
		copy: {
			html: {
				src: 'src/.grunt-tmp/index.final.html',
				dest: 'dist/index.html'
			},
			manifest: {
				src: 'src/manifest.json',
				dest: 'dist/manifest.json'
			},
			sw: {
				src: 'src/service-worker.js',
				dest: 'dist/service-worker.js'
			},
			favicon: {
				src: 'src/favicon.png',
				dest: 'dist/favicon.png'
			},
			assets: {
				expand: true,
				cwd: 'src/assets',
				src: '**',
				dest: 'dist/assets/'
			},
			gruntPrepare: {
				expand: true,
				cwd: 'src/',
				src: '**',
				dest: 'src/.grunt-tmp/'
			}
		},
		
		template: {
			build: {
				options: {
					data: {
						version: '<%= pkg.version %>'
					}
				},
				files: {
					'src/.grunt-tmp/index.html': ['src/.grunt-tmp/index.html']
				}
			}
		},
		
		embed: {
			options: {
				threshold: '2048KB'
			},
			target: {
				files: {
					'dist/index.min.html': 'dist/index.html'
				}
			}
		},
		
		clean: [
			'src/.grunt-tmp'
		],
		
		'sw-precache': {
			options: {
				cacheId: 'zemit-layout-engine',
				workerFileName: 'service-worker.js',
				verbose: true,
			},
			default: {
				staticFileGlobs: [
					'**/*',
				],
			}
		},
		
		babel: {
			options: {
				sourceMap: true,
				presets: ['latest']
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'src/.grunt-tmp/',
					src: ['**/*.js'],
					dest: 'src/.grunt-tmp/',
					ext:'.js'
				}]
			}
		},
		
		replace: {
			dist: {
				options: {
					patterns: [{
						match: 'href="..',
						replacement: 'href="../..'
					}, {
						match: 'src="..',
						replacement: 'src="../..'
					}],
					prefix: ''
				},
				files: [{
					src: ['src/.grunt-tmp/index.html'], 
					dest: 'src/.grunt-tmp/index.html'
				}]
			}
		},
		
		replace_attribute: {
			target: {
				options: {
					upsert: true,
					replace: {
						html: { 
							manifest: 'manifest.appcache?v=<%= pkg.version %>'
						}
					}
				},
				files: {
					'src/.grunt-tmp/index.final.html': 'src/.grunt-tmp/index.html'
				}
			},
		},
		
		language: {
			pot: {
				options: {
					dest: 'src/core/i18n/literals.pot',
					regex: /([>\s:.]t|\$i18n\.get)\(('|")([^'"]+[^\\])('|")(,|\))(\s*{)?\)?/gm
				},
				files: [{
					src: ['src/core/**/*.html', 'src/core/**/*.js']
				}]
			},
			json: {
				options: {
					dest: 'src/core/i18n/literals.json',
				},
				files: [{
					src: ['src/core/i18n/*.po']
				}]
			},
			build: {
				options: {
					dest: 'src/core/i18n/literals.js'
				},
				files: [{
					src: ['src/core/i18n/literals.json']
				}]
			}
		},
		
		appcache: {
			options: {
				basePath: 'dist'
			},
			all: {
				dest: 'dist/manifest.appcache',
				cache: {
					patterns: [
						'dist/**/*',
						'!dist/index.html'
					]
				},
				network: '*',
				fallback: '/ /index.min.html?standalone=1'
			}
		},
		
		version: {
			somejs: {
				src: [
					'dist/assets/js/zemit.min.js'
				]
			},
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-include-source');
	grunt.loadNpmTasks('grunt-embed');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-assets-inline');
	grunt.loadNpmTasks('grunt-sw-precache');
	grunt.loadNpmTasks('grunt-appcache');
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-template-render');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-replace-attribute');

	grunt.registerMultiTask('language', 'Pot file generator', function(args) {
		
		let config = grunt.config('language');

		switch(this.target) {
			case 'pot':
				
				this.files.forEach(function(file) {
					
					var contents = file.src.filter(function(filepath) {
						if (!grunt.file.exists(filepath)) {
							grunt.log.warn('Source file "' + filepath + '" not found.');
							return false;
						}
						else {
							return true;
						}
					}).map(function(filepath) {
						return grunt.file.read(filepath);
					}).join('\n');
		
					let literals = [];
					let matches;
					while ((matches = config.pot.options.regex.exec(contents)) !== null) {
						
						// This is necessary to avoid infinite loops with zero-width matches
						if (matches.index === config.pot.options.regex.lastIndex) {
							config.pot.options.regex.lastIndex++;
						}
						
						let literal = matches[3];
						if(literals.indexOf(literal) === -1) {
							literals.push(literal);
						}
					}
					
					literals.sort();
					grunt.log.ok(literals.length + ' literal(s) found.');
					
					let potContents = '';
					literals.forEach((literal, index) => {
						potContents += 'msgid "' + literal + '"' + "\r\n";
						potContents += 'msgstr ""';
						
						if(index < literals.length - 1) {
							 potContents += "\r\n\r\n";
						}
					});
					
					grunt.file.write(config.pot.options.dest, potContents);
					grunt.log.writeln('POT file generated: ' + config.pot.options.dest);
				});
				
				break;
				
			case 'json':
				
				var totalLiterals = 0;
				this.files.forEach(function(file) {
					
					var literals = file.src.filter(function(filepath) {
						if (!grunt.file.exists(filepath)) {
							grunt.log.warn('Source file "' + filepath + '" not found.');
							return false;
						}
						else {
							return true;
						}
					}).map(function(filepath) {
						
						let buildPath = ((data, parts, value) => {
							
							if(parts.length === 1) {
								data[parts[0]] = value;
							}
							else {
								
								if(!data[parts[0]]) {
									data[parts[0]] = {}
								}
								
								let newData = data[parts[0]];
								parts.splice(0, 1);
								buildPath(newData, parts, value);
							}
						});
						
						var contents = grunt.file.read(filepath);
						var lang = filepath.replace(/^.*[\\\/]/, '').split('.')[0];
						var literals = {};
						literals[lang] = {};
						
						var inStr = false;
						var lastId;
						var lastValue;
						var lines = contents.split('\n');
						lines.forEach(function(line, lkey) {
							
							var regId = /msgid "([^\""]*)"/gim.exec(line);
							var regStr;
							
							if(inStr) {
								regStr = /"([^\""]*)"/gim.exec(line);
							}
							else {
								regStr = /msgstr "([^\""]*)"/gim.exec(line);
							}
							
							var id = regId && regId[1] && regId[1].trim();
							var str = regStr && regStr[1] && regStr[1].trim();
							
							inStr = (regStr && regStr.length > 0);
							
							if(id) {
								
								if(lastId) {
									var parts = lastId.split('.');
									buildPath(literals[lang], parts, lastValue);
									totalLiterals++;
								}
								
								lastId = id;
								lastValue = '';
							}
							if(inStr) {
								
								lastValue = (lastValue + (' ' + str)).trim();
							}
						});
						
						if(lastId) {
							var parts = lastId.split('.');
							buildPath(literals[lang], parts, lastValue);
							totalLiterals++;
						}
						
						return literals;
					});
					
					grunt.log.ok(file.src.length + ' languages found.');
					grunt.log.ok(totalLiterals + ' literals converted.');
					
					var json = {};
					literals.forEach((literal) => {
						var keys = Object.keys(literal);
						json[keys[0]] = literal[keys[0]];
					});
					
					var jsonContents = JSON.stringify(json);
					grunt.file.write(config.json.options.dest, jsonContents);
					grunt.log.writeln('JSON file generated: ' + config.json.options.dest);
				});
				
				break;
				
			case 'build':
				
				var totalLiterals = 0;
				this.files.forEach(function(file) {
					
					var contents = file.src.filter(function(filepath) {
						if (!grunt.file.exists(filepath)) {
							grunt.log.warn('Source file "' + filepath + '" not found.');
							return false;
						}
						else {
							return true;
						}
					}).map(function(filepath) {
						return grunt.file.read(filepath);
					});
					
					var results = `Zemit.app.run(['$i18n', function($i18n) {`;
					var literals = JSON.parse(contents);
					var keys = Object.keys(literals);
					keys.forEach((lang) => {
						results += `$i18n.load('` + lang + `', ` + JSON.stringify(literals[lang]) + `);`;
					});
					results += `}]);`;
					
					grunt.file.write(config.build.options.dest, results);
					grunt.log.writeln('Literals file cached: ' + config.build.options.dest);
				});
				
				break;
		}
	});

	// Default task(s).
	grunt.registerTask('build', [
		'copy:gruntPrepare',
		'assets_inline', 'ngtemplates', 'i18n:build', 'includeSource', 'babel', 'replace', 'useminPrepare', 'concat',
		'uglify', 'cssmin', 'usemin', 'template:build', 'replace_attribute',
		'copy:html', 'copy:manifest', 'copy:sw', 'copy:favicon', 'copy:assets',
		'embed', 'version', 'clean', 'sw-precache', 'appcache'
	]);
	
	grunt.registerTask('i18n:pot', ['language:pot']);
	grunt.registerTask('i18n:json', ['language:json']);
	grunt.registerTask('i18n:build', ['language:json', 'language:build']);
};
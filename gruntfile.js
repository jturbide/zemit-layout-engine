var deepMerge = require('deepmerge');

module.exports = function(grunt) {
	
	// Project configuration.
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		
		app: {
			scripts: [],
			styles: []
		},
		
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
					'src/.grunt-tmp/core/components/sidebar/sidebar.html': 'src/.grunt-tmp/core/components/sidebar/sidebar.html',
				}
			}
		},
		
		ngtemplates: {
			zemit: {
				cwd: 'src/.grunt-tmp',
				src: ['core/components/**/*.html', 'core/directives/**/*.html'],
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
						version: '<%= pkg.version %>',
						app: {
							scripts: ['src/modules/easteregg/easteregg.js'],
							styles: ['src/modules/easteregg/easteregg.css']
						}
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
				presets: ['env']
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
		
		zmModule: {
			build: {
				files: [{
					src: ['src/modules/settings.js']
				}]
			}
		},
		
		language: {
			pot: {
				options: {
					regex: /([>\s:.]t|\$i18n\.get)\(('|")([^'"]+[^\\])('|")(,|\))(\s*{)?\)?/gm
				},
				files: [{
					src: ['src/**/*.html', 'src/**/*.js']
				}]
			},
			json: {
				files: [{
					src: ['src/**/i18n/*.po']
				}]
			},
			build: {
				options: {
					dest: 'src/assets/i18n/literals.js'
				},
				files: [{
					src: ['src/**/i18n/literals.json']
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
					'src/.grunt-tmp/zemit.js'
				]
			},
		}
	});
	
	grunt.registerMultiTask('zmModule', 'Module compiler', function(args) {
		
		let app = grunt.config('app');
		let ngtemplates = grunt.config('ngtemplates');
		
		switch(this.target) {
			case 'build':
				
				this.files.forEach(function(file) {
					let contents = file.src.filter(function(filepath) {
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
					
					let regex = /\$modules.bootstrap\(\[([^\]\*]*)\]\)/gim;
					let matches = regex.exec(contents);
					let modules = matches[1].replace(/(\s|'|"|\*)/gim,'').split(',');
					
					modules.forEach(function(module) {
						let script = 'modules/' + module + '/**/*.js';
						let style = 'modules/' + module + '/**/*.css';
						let template = 'modules/' + module + '/**/*.html';
						
						app.scripts.push(script);
						app.styles.push(style);
						
						ngtemplates.zemit.src.push(template);
						
						grunt.config.set('app', app);
						grunt.config.set('ngtemplates', ngtemplates);
					});
				});
				
				break;
		}
	});

	grunt.registerMultiTask('language', 'Pot file generator', function(args) {
		
		let config = grunt.config('language');

		switch(this.target) {
			case 'pot':
				
				let pots = {};
				
				this.files.forEach(function(file) {
					
					file.src.filter(function(filepath) {
						if (!grunt.file.exists(filepath)) {
							grunt.log.warn('Source file "' + filepath + '" not found.');
							return false;
						}
						else {
							return true;
						}
					}).map(function(filepath) {
						
						let defaultPot = 'src/core';
						let potDir = filepath.split("/").slice(0,-1).join("/");
								
						if(!grunt.file.isDir(potDir + '/i18n')) {
							potDir = defaultPot;
						}
						
						if(!pots[potDir]) {
							pots[potDir] = grunt.file.read(filepath);
						}
						else {
							pots[potDir] += "\n" + grunt.file.read(filepath);
						}
						
						return;
					});
		
					for(let potDir in pots) {
		
						let literals = [];				
						let contents = pots[potDir];
						
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
						
						let dest = potDir + '/i18n/literals.pot';
						grunt.file.write(dest, potContents);
						grunt.log.writeln('POT file generated: ' + dest);
					}
				});
				
				break;
				
			case 'json':
				
				let jsons = {};
				let stats = {};
				this.files.forEach(function(file) {
					
					let totalLiterals = 0;
					
					let literals = file.src.filter(function(filepath) {
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
						
						let defaultPot = 'src/core/i18n';
						let jsonDir = filepath.split("/").slice(0,-1).join("/");
								
						if(!grunt.file.isDir(jsonDir)) {
							jsonDir = defaultPot;
						}
						
						if(!jsons[jsonDir]) {
							jsons[jsonDir] = literals;
							stats[jsonDir] = {
								totalLanguages: 1,
								totalLiterals: totalLiterals
							};
						}
						else {
							jsons[jsonDir] = deepMerge(jsons[jsonDir], literals);
							stats[jsonDir].totalLanguages++;
						}
					});
					
					for(let jsonDir in jsons) {
						
						grunt.log.ok(stats[jsonDir].totalLanguages + ' language(s) found.');
						grunt.log.ok(stats[jsonDir].totalLiterals + ' literal(s) converted.');
						
						var jsonContents = JSON.stringify(jsons[jsonDir]);
						let dest = jsonDir + '/literals.json';
					
						grunt.file.write(dest, jsonContents);
						grunt.log.writeln('JSON file generated: ' + dest);
					}
				});
				
				break;
				
			case 'build':
				
				var totalLiterals = 0;
				var literals = {};
				this.files.forEach(function(file) {
					
					file.src.filter(function(filepath) {
						if (!grunt.file.exists(filepath)) {
							grunt.log.warn('Source file "' + filepath + '" not found.');
							return false;
						}
						else {
							return true;
						}
					}).map(function(filepath) {
						
						let json = JSON.parse(grunt.file.read(filepath));
						literals = deepMerge(literals, json);
						return;
					});
				});
				
				var results = `Zemit.app.run(['$i18n', function($i18n) {`;
				var keys = Object.keys(literals);
				keys.forEach((lang) => {
					results += `$i18n.load('` + lang + `', ` + JSON.stringify(literals[lang]) + `);`;
				});
				results += `}]);`;
				
				grunt.file.write(config.build.options.dest, results);
				grunt.log.writeln('Literals file cached: ' + config.build.options.dest);
				
				break;
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

	// Tasks declaration
	grunt.registerTask('default', ['build']);
	
	grunt.registerTask('build', [
		'module:build',
		
		'copy:gruntPrepare',
		
		'version', 'assets_inline', 'ngtemplates', 'includeSource', 'babel', 'replace', 'useminPrepare', 'concat',
		'uglify', 'cssmin', 'usemin', 'template:build', 'replace_attribute', 'version', 'i18n',
		// 'version', 'assets_inline', 'ngtemplates', 'includeSource', 'replace', 'useminPrepare', 'concat',
		// 'replace_attribute', 'version', 'i18n:build',
		
		'copy:html', 'copy:manifest', 'copy:sw', 'copy:favicon', 'copy:assets',
		
		'embed', 'clean', 'sw-precache', 'appcache'
	]);
	
	grunt.registerTask('module:build', ['zmModule:build']);
	
	grunt.registerTask('i18n', ['language:pot', 'language:json', 'language:build']);
	grunt.registerTask('i18n:pot', ['language:pot']);
	grunt.registerTask('i18n:json', ['language:json']);
	grunt.registerTask('i18n:build', ['language:build']);
};
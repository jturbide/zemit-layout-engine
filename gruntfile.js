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
				src: 'src/.grunt-tmp/index.html',
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
				threshold: '1024KB'
			},
			some_target: {
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
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

	// Default task(s).
	grunt.registerTask('default', [
		'copy:gruntPrepare',
		'assets_inline', 'ngtemplates', 'includeSource', 'babel', 'replace', 'useminPrepare', 'concat',
		'uglify', 'cssmin', 'usemin', 'template:build',
		'copy:html', 'copy:manifest', 'copy:sw', 'copy:favicon', 'copy:assets',
		'embed', 'version', 'clean', 'sw-precache', 'appcache'
	]);
};
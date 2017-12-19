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
				basePath: 'src',
				baseUrl: '',
				ordering: 'top-down'
			},
			app: {
				files: {
					'src/.index.grunt-tmp.html': 'src/index.html'
				}
			}
		},
		
		useminPrepare: {
			html: 'src/.index.grunt-tmp.html'
		},
 
		usemin: {
			html: ['src/.index.grunt-tmp.html']
		},
 
		uglify: {
			options: {
				report: 'min',
				mangle: false
			}
		},
		
		copy: {
			html: {
				src: 'src/.index.grunt-tmp.html',
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
			ngassets: {
				expand: true,
				cwd: 'src/assets',
				src: '**',
				dest: 'src/.grunt-tmp/assets/'
			},
			ngcomponents: {
				expand: true,
				cwd: 'src/components',
				src: '**',
				dest: 'src/.grunt-tmp/components/'
			},
			ngdirectives: {
				expand: true,
				cwd: 'src/directives',
				src: '**',
				dest: 'src/.grunt-tmp/directives/'
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
					'dist/index.html': ['dist/index.html']
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
			'src/.grunt-tmp',
			'src/.index.grunt-tmp.html'
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
				fallback: '/ /index.min.html'
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

	// Default task(s).
	grunt.registerTask('default', [
		'copy:ngassets', 'copy:ngcomponents', 'copy:ngdirectives', 'assets_inline',
		'ngtemplates', 'includeSource', 'useminPrepare', 'concat',
		'uglify', 'cssmin', 'usemin', 'copy:html', 'copy:manifest', 'copy:sw', 'copy:favicon',
		'copy:assets', 'version', 'template:build', 'embed', 'clean', 'sw-precache', 'appcache'
	]);
};
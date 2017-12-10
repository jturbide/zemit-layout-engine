module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		app: {
			scripts: [
				'src/.grunt-tmp/templates.js',
			]
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
		
        ngtemplates: {
        	zemit: {
        		cwd: 'src',
        		src: ['components/**/*.html', 'directives/**/*.html'],
        		dest: 'src/.grunt-tmp/templates.js'
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
			favicon: {
				src: 'src/favicon.png',
				dest: 'dist/favicon.png'
			},
			assets: {
				expand: true,
				cwd: 'src/assets',
				src: '**',
				dest: 'dist/assets/'
			}
		},
		
		embed: {
			options: {
				threshold: '1024KB'
			},
			some_target: {
				files: {
					'dist/index.base64.html': 'dist/index.html'
				}
			}
		},
		
		assets_inline: {
			options: {
        		inlineImg: true
			},
			all: {
				files: {
					'dist/index.base64.html': 'dist/index.base64.html'
				}
			}
		},
        
        clean: [
        	'src/.grunt-tmp',
        	'src/.index.grunt-tmp.html'
    	]
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

	// Default task(s).
	grunt.registerTask('default', [
    	'ngtemplates', 'includeSource', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'copy', 'embed', 'assets_inline', 'clean'
    ]);
};
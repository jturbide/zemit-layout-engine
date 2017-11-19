module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		copy: {
			html: {
				src: 'src/index.html',
				dest: 'dist/index.html'
			},
			// fa: {
			// 	expand: true,
			// 	cwd: 'node_modules/font-awesome/fonts',
			// 	src: '*',
			// 	dest: 'dist/fonts/'
			// },
			// widgets: {
			// 	expand: true,
			// 	cwd: 'src/components/widget/',
			// 	src: '*/**',
			// 	dest: 'dist/components/widget/'
			// }
		},
		
		embedFonts: {
			all: {
				files: {
					'src/cache/typeface-rock-salt.css': ['node_modules/typeface-rock-salt/index.css']
				}
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
		
		useminPrepare: {
            html: 'src/index.html'
        },
 
        usemin: {
            html: ['dist/index.html']
        },
 
        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        },
        
        ngtemplates: {
        	zemit: {
        		cwd: 'src',
        		src: ['components/**/*.html', 'directives/**/*.html'],
        		dest: 'src/cache/templates.js'
        	}
        },
        
        css_url_replace: {
			replace: {
				files: {
					'dest/build.css': ['css/application.css', 'css/users/default.css']
				}
			}
        }
	});

	// Load the plugins
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-css-url-replace');
    grunt.loadNpmTasks('grunt-embed-fonts');
    grunt.loadNpmTasks('grunt-embed');

	// Default task(s).
	grunt.registerTask('default', [
        'copy', 'embedFonts', 'ngtemplates', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'embed'//, 'rev'
    ]);
};
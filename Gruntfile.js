module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			prod: {
				files: {
					'web/js/app.js': 'tmp/app.js'
				}
			}
		},
	
	    browserify: {
			dev: {
				files: {
					'web/js/app.js': ['src/main.js']
				},
				options: {
					debug: true,
					transform: ['hbsfy', 'browserify-shim']
				}
			},
			prod: {
				files: {
					'tmp/app.js': ['src/main.js'],
				},
				options: {
					transform: ['hbsfy', 'browserify-shim']
				}
			}
		},
	    
		watch: {
			dev: {
				files: [
					'src/**/*.js',
					'tpl/**/*.hbs'
				],
				tasks: [
					'browserify:dev'
				],
				options: {
					livereload: true,
					spawn: false,
					atBegin: true
				}
			}
	    },
	
		connect: {
			dev: {
				options: {
					port: 3000,
					base: 'web/'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.registerTask('debug', [
		'browserify:dev'
	]);
	
	grunt.registerTask('server', [
		'connect:dev',
		'watch:dev'
	]);
	
	grunt.registerTask('release', [
		'browserify:prod',
		'uglify:prod'
	]);
	
	grunt.registerTask('default', [
		'debug'
	]);
};

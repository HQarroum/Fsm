module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Timing the build tasks.
    require('time-grunt')(grunt);

    grunt.initConfig({
	clean: {
	    dist: 'dist/*',
	},
	jshint: {
	    dist: {
		src: ['Gruntfile.js', 'fsm.js']
	    },
	    test: {
		src: ['tests/*.js']
	    }
	},
	uglify: {
	    dist: {
		src: 'fsm.js',
		dest: 'dist/fsm.min.js'
	    }
	},
	jasmine: {
	    dist: {
		options: {
		    specs: ['tests/fsm-spec.js'],
		    template: require('grunt-template-jasmine-requirejs'),
		    templateOptions: {
			requireConfig: {
			    buildPath: '../'
			}
		    },
		    junit: {
			path: 'reports/junit/jasmine'
		    }
		}
	    }
	}
    });

    // Registering the tasks.
    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'test']);
};

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Timing the build tasks.
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: {
	    dist: 'dist/*'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
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
    mochaTest: {
      test: {
        src: ['tests/**/*.js']
      }
    }
  });

  // Registering the tasks.
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'test']);
};

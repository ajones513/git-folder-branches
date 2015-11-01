module.exports = function(grunt) {
      grunt.initConfig(
        {
            jshint: {
                options: {
                    jshintrc: true
                },
                source: {
                    files: [ {src: ['./**/*.js', '!./node_modules/**']} ]
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-jshint');
};

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! allocine plugin for cleditor - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* https://github.com/tlechauve/cleditor-allocine-plugin\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Thomas Lechauve; Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'src/jquery.cleditor.allocine.js']
    },
    concat: {
      dist: {
          src: ['<banner:meta.banner>', '<file_strip_banner:libs/mustache/mustache.js>', '<file_strip_banner:libs/allocine/jquery.allocine.js>', '<file_strip_banner:src/jquery.cleditor.allocine.js>'],
        dest: 'dist/jquery.cleditor.allocine.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/jquery.cleditor.allocine.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        console: true,
        Mustache: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat min');

};

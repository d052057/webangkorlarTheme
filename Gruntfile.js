'use strict';

const path = require('path');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const pkg = require('./package.json');

const SWATCHES = [
  'webangkorlar'
];

const BUILD_DIR = 'build/';
const DIST_DIR = 'dist/';
const DOCS_DEST = 'docs/5/';
let buildTheme = '';

module.exports = grunt => {
  grunt.loadNpmTasks('@lodder/grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-html');

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  grunt.initConfig({
    clean: {
      build: {
        src: 'dist/*/build.scss'
      }
    },
    concat: {
      dist: {
        src: [],
        dest: ''
      }
    },
    sass: {
      options: {
        implementation: sass,
        outputStyle: 'expanded'
      },
      dist: {
        src: [],
        dest: ''
      }
    },
    postcss: {
      options: {
        processors: [
          autoprefixer({ cascade: false })
        ]
      },
      dist: {
        src: [],
        dest: ''
      }
    },
    cssmin: {
      options: {
        level: {
          1: {
            specialComments: 'all'
          }
        }
      },
      dist: {
        src: [],
        dest: ''
      }
    },
    htmllint: {
      options: {
        ignore: [
          /Attribute “autocomplete” is only allowed when the input type is.*/
        ]
      }
    },
    connect: {
      options: {
        hostname: 'localhost',
        livereload: 35729,
        port: 3000,
        open: true
      },
      base: {
        options: {
          base: 'docs'
        }
      }
    },
    watch: {
      options: {
        livereload: '<%= connect.options.livereload %>',
        spawn: false
      },
      dev: {
        files: [
          'dist/*/_variables.scss',
          'dist/*/_webangkorlarTheme.scss'
        ],
        tasks: 'build'
      }
    }
  });

  grunt.registerTask('build', 'build a regular theme from scss', theme => {
    theme = theme ? theme : buildTheme;

    const themeDir = path.join(DIST_DIR, '/', theme);
    const isValidTheme = grunt.file.exists(path.join(themeDir, '/_variables.scss')) && grunt.file.exists(path.join(themeDir, '/_webangkorlarTheme.scss'));

    // cancel the build (without failing) if this directory is not a valid theme
    if (!isValidTheme) {
      grunt.log.writeln(`${theme} theme does not exist!`);
      return;
    }

    const concatSrc = path.join(BUILD_DIR, '/scss/build.scss');
    const concatDest = path.join(themeDir, '/build.scss');
    const cssDest = path.join(themeDir, '/bootstrap.css');
    const cssDestMin = path.join(themeDir, '/bootstrap.min.css');

    grunt.config.set('concat.dist', {
      src: concatSrc,
      dest: concatDest
    });
    grunt.config.set('sass.dist', {
      src: concatDest,
      dest: cssDest
    });
    grunt.config.set('postcss.dist', {
      src: cssDest,
      dest: cssDest
    });
    grunt.config.set('copy.css.files.0.cwd', themeDir);
    grunt.config.set('copy.css.files.0.dest', path.join(DOCS_DEST, theme));
    grunt.config.set('cssmin.dist', {
      src: cssDest,
      dest: cssDestMin
    });

    grunt.task.run([
      'concat',
      'sass:dist',
      'postcss:dist',
      'clean:build',
      'cssmin:dist'
    ]);
  });

  grunt.registerTask('swatch', 'build a theme from scss ', theme => {
    // If no theme is passed, build all swatches
    theme = theme ? [theme] : SWATCHES;

    theme.forEach(t => {
      grunt.task.run(`build:${t}`);
    });
  });

  grunt.event.on('watch', (action, filepath) => {
    const theme = path.basename(path.dirname(filepath));

    grunt.log.writeln(`${theme} changed...`);
    buildTheme = theme;
  });

  grunt.registerTask('default', ['connect', 'watch']);
  grunt.registerTask('vendor', 'copy:vendor');
  grunt.registerTask('release', ['swatch', 'docs']);
};

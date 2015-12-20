'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    copy:{
      hg:{
        expand: true,                   // 需要该参数
        cwd: 'res/',                 //src的相对路径
        src: ['**/*','!**/*.svn'],
        dest: 'dist/'
      }
    },
    concat:{
      hg_js:{
        src:[
          'dist/lib/jquery/dist/jquery.js',
          'dist/lib/handlebars/handlebars.js',
          'dist/common/zcache.js',
          'dist/common/config.js',
          'dist/common/common.js'
          'dist/common/counter.js',
        ],
        dest:'dist/common/max.js'
      },
      hg_css:{
        src:[
          'dist/theme/default/cssnormalize-min.css',
          'dist/theme/default/common.css',
          'dist/theme/default/page.css'
        ],
        dest:'dist/theme/default/max.css'
      }
    },
    uglify:{
      hg:{
        options: {
            //mangle: false, //不混淆变量名
            preserveComments: false//all不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
            //footer:'\n/*! 这是footer */'//添加footer
        },
        files: [{
          expand:true,
          cwd:'dist/common',//起始目录
          src:'max.js',
          ext:'.min.js',//后缀
          dest: 'dist/common'//输出到
        }]
      }
    },
    cssmin:{
      hg:{
        files: [{
          expand:true,
          cwd:'dist/theme/default',//起始目录
          src:'max.css',
          ext:'.min.css',//后缀
          dest: 'dist/theme/default'//输出到
        }]
      }
    },
    processhtml:{
      hg:{
        files:[
            {
              expand: true,     
              cwd: 'dist/module/include',
              src: ['*.html'],
              dest:'dist/module/include',  
              ext: '.html'
            }
        ]
      }
    }
  });

  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('hg', [
    'copy:hg',
    'concat:hg_js',
    'uglify:hg',
    'concat:hg_css',
    'cssmin:hg',
    'processhtml:hg'
  ]);

};

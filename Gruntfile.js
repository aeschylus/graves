

require('babel/register');


module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  require('load-grunt-config')(grunt, {

    loadGruntTasks: false,

    data: {
      js:  'app/assets/javascripts',
      css: 'app/assets/stylesheets',
    }

  });

};

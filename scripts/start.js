module.exports = (function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var helper = require('./helper');
  var $log = require('./utils/log');
  var $rmdir = path.resolve(__dirname, 'utils/rmdir');

  var routines = { parallel: false, tasks: [] };

  /**
   * @private
   * @returns {void}
   * @description Configure task to be executed.
   */
  function configureRoutineTasks() {
    // App release
    if(fs.existsSync(path.resolve(__dirname, '../dist'))) {
      routines.tasks.push({
				description: 'Cleaning project. Starting to remove "dist/" folder.',
				file: $rmdir,
				arguments: path.resolve(__dirname, '../dist')
      });
    }

    // Dependencies
    if(!fs.existsSync(path.resolve(__dirname, '../node_modules'))) {
      routines.tasks.push({
        description: 'Installing dependencies',
        command: 'npm install --info=progress2 --supress-warnings'
      });
    }

    // Default
    routines.tasks.push({
      description: 'Starting local webserver',
      command: 'npm run dev --info=progress2 --supress-warnings'
    });
  }

  /**
   * @private
   * @returns {void}
   * @description Starts development environment based on webpack
   *              configuration.
   */
  function start() {
    try {
      configureRoutineTasks();
      helper.process.execute(routines);
    } catch (e) {
      $log.error(e);
    }
  }

  /**
   * @description Execute start process.
   */
  start();
})();

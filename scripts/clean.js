module.exports = (function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var helper = require('./helper');
  var $log = require('./utils/log');
  var $rmdir = path.resolve(__dirname, 'utils/rmdir');

  var routines = {
    parallel: false,
    tasks: []
  };

  /**
   * @private
   * @returns {void}
   * @description Configure task to be executed.
   */
  function configureRoutineTasks() {

    if (fs.existsSync(path.resolve(__dirname, '../package-lock.json'))) {
      console.log('removing package-lock.json...');
      fs.unlinkSync(path.resolve(__dirname, '../package-lock.json'));
      console.log('removed package-lock.json')
  }

  // App release.
  if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
    routines.tasks.push({
      description: 'Cleaning project',
      subdescription: 'Starting to remove "dist/" folder',
      file: $rmdir,
      arguments: path.resolve(__dirname, '../dist')
    });
  }

  // Dependencies.
  if (fs.existsSync(path.resolve(__dirname, '../node_modules'))) {
    routines.tasks.push({
      description: 'Removing old dependencies',
      file: $rmdir,
      arguments: path.resolve(__dirname, '../node_modules')
    });
  }

}

/**
 * @private
 * @returns {void}
 * @description Remove dist/ and node_modules/ folder.
 */
function clean() {
  try {
    configureRoutineTasks();
    if (routines.tasks.length > 0) helper.process.execute(routines);
    else $log.info('Project clean!', 'Type "npm run start" for development or "npm run build" to build project');
  } catch (e) {
    $log.error('Cannot clean project due of: ' + e);
  }
}

/**
 * @description Execute clean task.
 */
clean();
})();
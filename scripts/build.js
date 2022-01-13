module.exports = (function () {
  'use strict';

  var helper = require('./helper');
  var $log = require('./utils/log');

  var routines = {
    parallel: false,
    tasks: [
      {
        command: 'npm run clean --info=progress2 --supress-warnings'
      },
      {
        description: 'Installing dependencies',
        command: 'npm install --info=progress2 --supress-warnings'
      },
      {
        command: 'npm run prod --info=progress2 --supress-warnings'
      }
    ]
  };

  /**
   * @return {void}
   * @description Remove dist/ and node_modules/ folders.
   *              Download dependencies as such as
   *              they are listed within 'package.json' file.
   */
  function build() {
    try {
      helper.process.execute(routines);
    } catch (e) {
      $log.error(e);
      process.kill();
    }
  }

  /**
   * @description Execute build.
   */
  build();
})();

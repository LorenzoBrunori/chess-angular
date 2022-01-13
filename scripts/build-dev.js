module.exports = (function () {
  'use strict';

  var helper = require('./helper');
  var $log = require('./utils/log');

  var routines = {
    parallel: false,
    tasks: [
      {
        command: 'npm run dev --info=progress2 --supress-warnings'
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

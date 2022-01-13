module.exports = (function() {
    var time = require('./time');

    /**
     * @public
     * @param {string} text
     * @returns {void}
     */
    function info(text, subtext) {
      var info = (subtext)
        ? '\n--- \x1b[32m' + text + '\x1b[37m (' + subtext + ') ---'
        : '\n--- \x1b[32m' + text + '\x1b[37m ---';
      if(text) console.log(info);
    }

    /**
     * @public
     * @param {string} text
     * @returns {void}
     */
    function error(text) {
      console.log('\x1b[31m',text);
    }

    return {
      info: info,
      error: error
    };
  })();

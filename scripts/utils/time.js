module.exports = (function () {
  'use strict';
  var now = new Date;

  /**
   * @private {time}
   * @param {string} referenceFn
   */
  function time(referenceFn) {
    var pattern = /^[0-9]$/g;
    var comparison = new RegExp(pattern);
    var unit = comparison.test(now[referenceFn]());
    return (unit) ? '0'+now[referenceFn]() : now[referenceFn]();
  }

  /**
   * @public
   * @returns {string}
   * @description Current Date in 'hh:mm:ss' format.
   */
  return time('getHours') + ':' + time('getMinutes') + ':' + time('getSeconds');
})();

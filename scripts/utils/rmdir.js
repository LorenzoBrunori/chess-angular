module.exports = (function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');

  var CONFIG = {
    target: (process.argv && process.argv.length > 2) ? process.argv[2] : '',
    counter: { unit: 0, total: 0, partial: 0, percentage: 0 }
  };

  /**
   * @private
   * @param {string} message
   * @description Send a message to parent process.
   */
  function $notify(message) {
    if (process.send) process.send(message);
  }

  /**
   * @private
   * @returns {number}
   * @description Calculate number of files within a directory.
   */
  function targetSize(folder) {
    var folder = (folder) ? folder : CONFIG.target;
    if (folder && fs.existsSync(folder)) {

      fs.readdirSync(folder).forEach(function (file, index) {
        var current = folder + "/" + file;
        if (fs.statSync(current).isDirectory()) {
          targetSize(current);
        } else {
          CONFIG.counter.total++;
        }
      });
    }
  }

  /**
   * @private
   * @returns {void}
   * @description Calculate progress percentage of deleting process.
   */
  function calculatePercentage() {
    CONFIG.counter.unit = Math.floor(CONFIG.counter.total / 100);
    if(CONFIG.counter.partial === CONFIG.counter.unit) {
      CONFIG.counter.percentage++; CONFIG.counter.partial = 0;
    } else {
      CONFIG.counter.partial++;
    }
    $notify({ progressbar: true, percentage: CONFIG.counter.percentage });
  }

  /**
   * @private
   * @param {string} path
   * @return {void}
   * @description Remove directory recursively.
   */
  function deleteFolderRecursively(folder) {
    fs.readdirSync(folder).forEach(function (file, index) {
      var current = folder + "/" + file;
      if (fs.statSync(current).isDirectory()) {
        deleteFolderRecursively(current);
      } else {
        fs.unlinkSync(current);
        calculatePercentage();
      }
    });
    fs.rmdirSync(folder);
  };

  /**
   * @private
   * @return {void}
   * @description Public method invoked when the module is required.
   *              Remove 'directoryTarget' if it exists.
   */
  function $rmdir() {
    try {
      var dirname = path.basename(CONFIG.target);
      if (fs.existsSync(CONFIG.target)) targetSize(), deleteFolderRecursively(CONFIG.target);
      else $notify('Directory "' + dirname + '" do not exists.');
    }
    catch (err) {
      $notify(err);
    }
  };

  /**
   * @private
   * @returns {void}
   */
  function execute() {
    if (CONFIG.target) {
      $rmdir();
    } else {
      $notify('You must specify the folder you want remove.');
    }
  }

  // Execute code.
  execute();
})();

module.exports = (function () {
	'use strict';

	var vector = require('child_process');
	var $log = require('./log');
	var Progress = require('./progressbar/cli-progress');

  var CONFIG = { tasks: [], parallel: false };
  var child;
  var progressbar;

	/**
	 * @param {object} data
	 * @returns {void}
	 */
	function showProgressBar(data) {
		if(!progressbar) {
			var opt = { format: '[{bar}] {percentage}% ', barIncompleteChar: '.', barsize: 18, clear: true };
			var style = Progress.Presets.shades_classic;
			progressbar = new Progress.Bar(opt, style);
			progressbar.start(100, 0);
		} else {
			progressbar.update(data.percentage);
		}
	}

	/**
	 * @private
	 * @param {string} data
	 * @returns {void}
	 * @description Callback for message sent by child process.
	 */
	function message(data) {
		if (typeof data === 'string') $log.info(data);
		if (typeof data === 'object' && data.progressbar) showProgressBar(data);
	}

	/**
	 * @private
	 * @param {number} code
	 * @return {void}
	 * @description Callback on child process exit event.
	 */
	function exit(code) {
		// Remove just executed task.
    if(code === 0) CONFIG.tasks.shift();
	}

	/**
	 * @private
	 * @param {object} task
	 * @returns {object}
	 * @description Configure new process in a proper way.
	 */
	function configure(task) {
		var extra = (task.arguments) ? task.arguments : '';
		var file = (task.file) ? task.file : '';
		var options = {
			bash: { stdio: 'inherit', shell: true },
			script: { stdio: ["pipe", "pipe", "pipe", "ipc"] }
		};

		return (task.command) ?
			vector.spawn(task.command, options.bash) :
			vector.spawn('node', [file, extra], options.script);
  }

  /**
   * @private
   * @returns {void}
   * @description Process close event.
   */
  function close(code) {
    // Kill process if it exit with error.
    if(code !== 0) setTimeout(function() { console.log('\n'); CONFIG.tasks.length = 0; child.kill(); process.exit(0); }, 1000);

    // Complete progressbar.
    if(progressbar) progressbar.update(100);

    // Pass to next task within new process (only for serialized tasks).
    if (!CONFIG.parallel && CONFIG.tasks.length > 0) setTimeout(function() { child.kill(), serialize(); }, 1000);

    // Kill main process if all task are executed.
    if (CONFIG.tasks.length === 0) setTimeout(function() { console.log('\n'); process.exit(0); }, 1000);
  }

	/**
	 * @private
	 * @param {object} task
	 * @return {void}
	 * @description Generate new child process.
	 */
	function processGenerator(task) {
    // Description about the task which will be executed within the new process.
    if (task && task.description) $log.info(task.description, task.subdescription);

    // Configure child process properly.
    child = configure(task);

    // Handle child process message.
    child.on("message", message);

    // End child process event.
    child.on("exit", exit);

    // Process close.
    child.on("close", close);
	}

	/**
	 * @returns {void}
	 * @description Generate processes once at time.
	 */
	function serialize() {
		processGenerator(CONFIG.tasks[0]);
	}

	/**
	 * @private
	 * @returns {void}
	 * @description Generate all process for parallel execution.
	 */
	function parallelize() {
		for (var i = 0; i < CONFIG.tasks.length; i++) {
			processGenerator(CONFIG.tasks[i]);
		}
	}

	/**
	 * @public
	 * @param { ProcessInfo } info
	 * @description Spawn a child process and execute it.
	 */
	function execute(info) {
		try {
			CONFIG.tasks = info.tasks;
			CONFIG.parallel = info.parallel;
			return (CONFIG.parallel) ? parallelize() : serialize();
		} catch (e) {
      $log.error('Cannot spawn new process ', e);
      process.kill();
		}
	};

	return {
		execute: execute
	}
})();

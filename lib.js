const exec = require('child_process').exec;

const run = (command, execOptions = {}, {
  verbose = process.env.CEED_VERBOSE,
  _commit,
  _maybe
} = {}) => {
	return new Promise((resolve, reject) => {
		const execTime = process.hrtime();

		exec(command, execOptions, (err, stdout, stderr) => {
			const code = err ? err.code : 0;
			const cwd = execOptions.cwd || process.cwd();
			const [seconds, ns] = process.hrtime(execTime);

			const result = {
				code,
				error: err,
				failed: code !== 0,
				succeed: code === 0,
				output: stdout,
				value: stdout.trim(),
				values: stdout.trim().split(/\n/gmi),
				stderr
			};

			if (verbose) {
				console.log(`[${command}] exited with ${code} in ${seconds + (ns / 10e9)}s`);
			}

			if (code === 0 || _maybe) {
				resolve(result);
			} else if (_commit) {
				console.log(`Commit command failed with code ${code} in "${cwd}"`);
				console.log(`Error message:`);
				console.log(err.message);
				throw new Error(err);
			} else {
				reject(result);
			}
		});
	});
};

const commit = (command, execOptions, options) => {
	return run(command, execOptions, Object.assign({}, options, {_commit: true}));
};

const maybe = (command, execOptions, options) => {
	return run(command, execOptions, Object.assign({}, options, {_maybe: true}));
};

module.exports = {
	run,
	commit,
	maybe
};

const {
    run,
    commit,
    maybe
  } = require('./lib.js');

(async function () {
  // Get environmental variables
	const {
    TARGET_BRANCH = 'master'
  } = process.env;

	await run('rm /testFile').catch(() => {
		console.log('An error occurred');
	});

	const canPush = await maybe(`git pull origin ${TARGET_BRANCH} --dry-run`);

	if (canPush.failed) {
		console.error(`Couldn't pull ${TARGET_BRANCH} got code ${canPush.code}`);
	}

	await commit('touch file1');

	const echoTest = await commit('echo "test"');

	console.log(echoTest);

	await commit('touch file2', {
		cwd: './test'
	});

	await maybe('touch', {
		cwd: './test'
	});

	const sleeps = await Promise.all([
		maybe('sleep 5'),
		maybe('sleep 5')
	]);

	console.log('sleeps', sleeps);

	const elements = await maybe('ls /');

	for (let element of elements.values) {
		const stat = await maybe(`stat /${element}`);
		console.log(stat.output);
	}

	console.log('done');
})();

import test from 'ava';
import {run, maybe, commit} from '.';

test('methods', t => {
	t.truthy(run);
	t.truthy(maybe);
	t.truthy(commit);
});

test('run', async t => {
	t.plan(5);

	const runRes = await run('pwd');
	t.is(runRes.code, 0);
	t.is(runRes.succeed, true);
	t.is(runRes.failed, false);

	t.is(runRes.output, process.cwd() + '\n');
	t.is(runRes.value, process.cwd());
});

test('run throw', async t => {
	t.plan(4);

	const error = await t.throws(run('invalidcommand'));

	t.not(error.code, 0);
	t.is(error.failed, true);
	t.is(error.succeed, false);
});

test('maybe', async t => {
	t.plan(6);

	const maybeLs = await maybe('ls');
	t.is(maybeLs.code, 0);
	t.is(maybeLs.succeed, true);
	t.is(maybeLs.failed, false);

	const maybeFail = await maybe('ls /invalidpaths');

	t.not(maybeFail.code, 0);
	t.is(maybeFail.succeed, false);
	t.is(maybeFail.failed, true);
});

test('commit', async t => {
	t.plan(3);

	const commitPass = await commit('ls');
	t.is(commitPass.code, 0);
	t.is(commitPass.succeed, true);
	t.is(commitPass.failed, false);
});

test('output/value/values', async t => {
	t.plan(3);

	const echoTest = await maybe('echo "test"');
	t.is(echoTest.output, 'test\n');
	t.is(echoTest.value, 'test');
	t.deepEqual(echoTest.values, ['test']);
});

test('output/value/values multiline', async t => {
	t.plan(4);

	const echoTest = await maybe('ls', {
		cwd: './test/fixtures'
	});

	t.is(echoTest.code, 0);
	t.is(echoTest.output, 'file1.txt\nfile2.txt\n');
	t.is(echoTest.value, 'file1.txt\nfile2.txt');
	t.deepEqual(echoTest.values, ['file1.txt', 'file2.txt']);
});

# ceed [![Build Status](https://travis-ci.org/elmccd/ceed.svg?branch=master)](https://travis-ci.org/elmccd/ceed)

> Set of JS async utils making building pipelines in JS easier

Library is taking advantage of ES2017 `async/await` functionality to
allow creating more readable scripts performing command operations.

## Install

```
$ npm install --save ceed
```

## Running
You need node 6+ with the `--harmony` flag or installed [babel-cli](https://github.com/babel/babel/tree/master/packages/babel-cli)

`node --harmony app.js`

or

`./node_modules/.bin/babel-node app.js`

## Example app.js

```js
const {
    run,
    commit,
    maybe
  } = require('ceed');

(async function () {
    await commit('mkdir -p build', {}, {verbose: true});

	const build = await maybe('bash ./script.sh -o build');

	if (build.failed) {
	  //handle fail
	  console.log('Failed with: ' + build.code);
	}

	const builtItems = await run('ls', {
	  cwd: 'build'
	}).catch(err => {
	  //handle run promise rejection
	});

	buildItems.values.forEach(file => {
		console.log(`${file} built successfully`);
	});

})();

```


## API

Package exports three methods that share the same API with different
way of handling errors.

- `ceed.run(command: string, [execOptions]: Object, [ceedOptions]: {verbose: false})`
- `ceed.maybe(command: string, [execOptions]: Object, [ceedOptions]: {verbose: false})`
- `ceed.commit(command: string, [execOptions]: Object, [ceedOptions]: {verbose: false})`

See [node.js child_process.exec options](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
for all `execOptions`

**ceedOptions**:
- `verbose: boolean` - output result of every command. Default `false`.

You can set verbose option globally by setting env variable `CEED_VERBOSE` to true.

#### `ceed.run`

`Run` is a basic method which wraps `child_process.exec` into Promise
interface.

You can catch failed commands using Promise `.catch(fn)` syntax.

#### `ceed.maybe`

`Maybe` works like run, except when the command fails Promise is still
resolved successfully. You can get script exit code and status checking
`.succeed`, `.failed` or `.code` property in resolved object.

#### `ceed.commit`

`Commit` works like run, except on fail it throws an error instead of rejecting
 the promise and it outputs more failure details

### Resolved/Rejected object structure

```js
{
	code: number | string, //script return code
	error: Error, //.exec failure error object
	failed: boolean, //is .code different than 0
	succeed: boolean, //oposite of failed
	output: string, //value of stdout
	value: string, //trimmed .output
	values: Array<string>, //trimmed .output splitted by lines
	stderr: string // value of stderr
}
```

## License

MIT © [Maciej Dudzinski](http://github.com/elmccd)

import {setFailed, getInput, warning, setCommandEcho} from '@actions/core'
import {getOctokit, context} from '@actions/github'
import {env} from 'process';
import * as fs from 'fs';
import * as shell from 'shelljs';

async function run(): Promise<void> {
  try {
    const accessToken = getInput('access-token');
    const octokit = getOctokit(accessToken);
    const imageName = env['IMAGE_NAME'];
    const dockerFilePath = env['DOCKERFILE_PATH'];
    console.log(env['WORKING_DIRECTORY']);
    console.log(env['GITHUB_WORKSPACE']);
    warning(env['HOME'] || '');

    console.log(JSON.stringify(context,null, 2));
    const ws = env['GITHUB_WORKSPACE'] || '';
    printDir(ws);
    process.chdir(env['WORKING_DIRECTORY'] || '');

    const res = shell.exec('docker build -t '+ imageName + ' -f '+ dockerFilePath +' .');

    process.chdir(ws + '/..');
    fs.mkdirSync('test');
    printDir('.');

  } catch (error) {
    setFailed(error.message);
  }
}

function printDir(path: string) {
  fs.readdirSync(path).forEach(file => {
    console.log(file);
  });
}

run()
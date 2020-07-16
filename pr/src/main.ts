import {setFailed, getInput, warning, setCommandEcho} from '@actions/core'
import {getOctokit, context} from '@actions/github'
import {env} from 'process';
import * as fs from 'fs';
import * as shell from 'shelljs';

async function run(): Promise<void> {
  try {
    const accessToken = getInput('access-token');
    console.log(accessToken);
    const octokit = getOctokit(accessToken);
    console.log(env['WORKING_DIRECTORY']);
    console.log(env['GITHUB_WORKSPACE']);
    warning(env['HOME'] || '');

    fs.readdirSync(env['GITHUB_WORKSPACE'] || '').forEach(file => {
      console.log(file);
    });
    process.chdir(env['WORKING_DIRECTORY'] || '');
    const res = shell.exec('docker build -t dcrtest:1 -f DockerWorkerService/Dockerfile .');
    console.log(res.stdout);
    console.log(res.stderr);
    console.log(res.cat());
    
  } catch (error) {
    setFailed(error.message);
  }
}

run()
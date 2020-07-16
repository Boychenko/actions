import {setFailed, getInput, warning, setCommandEcho} from '@actions/core'
import {getOctokit, context} from '@actions/github'
import {env} from 'process';
import * as fs from 'fs';
import * as shell from 'shelljs';

async function run(): Promise<void> {
  try {
    const accessToken = getInput('access-token');
    const octokit = getOctokit(accessToken);
    console.log(env['WORKING_DIRECTORY']);
    console.log(env['GITHUB_WORKSPACE']);
    warning(env['HOME'] || '');

    console.log(JSON.stringify(context,null, 2));
    const ws = env['GITHUB_WORKSPACE'] || '';
    printDir(ws);
    process.chdir(env['WORKING_DIRECTORY'] || '');

    const res = shell.exec('docker build -t dcrtest:1 -f DockerWorkerService/Dockerfile .');

    process.chdir(ws + '/..');
    fs.mkdirSync('test');
    printDir('.');

    const runId = context.runId;
    const check = await octokit.checks.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      check_run_id: runId
    });

    console.log(JSON.stringify(check, null, 2));
    await octokit.checks.update({
      check_run_id: runId,
      //name: 'Tests Report',
      owner: context.repo.owner,
      repo: context.repo.repo,
      //status: 'completed',
      //conclusion: 'success',
      output: {
        title: 'Test',
        summary: 'Summary',
        text: 'Text'
      }
    })

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
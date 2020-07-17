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
    const principalId = env['AZURE_SERVICE_PRINCIPAL_ID'];
    const principalPassword = env['AZURE_SERVICE_PRINCIPAL_PASSWORD'];
    const registry = env['ACR_REGISTRY'];
    const dockerFilePath = env['DOCKERFILE_PATH'];
    console.log(env['WORKING_DIRECTORY']);
    console.log(env['GITHUB_WORKSPACE']);
    warning(env['HOME'] || '');

    //console.log(JSON.stringify(context,null, 2));
    const ws = env['GITHUB_WORKSPACE'] || '';
    printDir(ws);
    process.chdir(env['WORKING_DIRECTORY'] || '');

    let res = shell.exec('echo ' + principalPassword + ' | docker login -u ' + principalId + ' --password-stdin ' + registry + '.azurecr.io');
    if (res.code !== 0) {
      setFailed(res.stderr);
      return;
    }

    res = shell.exec('docker build -t ' + imageName + ' -f ' + dockerFilePath + ' .');
    if (res.code !== 0) {
      setFailed(res.stderr);
      return;
    }

    res = shell.exec('docker push ' + imageName);
    if (res.code !== 0) {
      setFailed(res.stderr);
      return;
    }

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
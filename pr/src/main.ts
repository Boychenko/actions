import {setFailed, getInput, warning, setCommandEcho} from '@actions/core'
import {getOctokit, context} from '@actions/github'
import {env} from 'process';

async function run(): Promise<void> {
  try {
    const accessToken = getInput('access-token');
    console.log(accessToken);
    const octokit = getOctokit(accessToken);
    console.log(env['WORKING_DIRECTORY']);
    console.log(env['GITHUB_WORKSPACE']);
    warning(env['HOME'] || '');
  } catch (error) {
    setFailed(error.message);
  }
}

run()
// GitHub integration via standard GITHUB_TOKEN env var
import { Octokit } from '@octokit/rest'

function getAccessToken(): string {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GitHub token not configured. Set GITHUB_TOKEN env var.');
  }
  return process.env.GITHUB_TOKEN;
}

export function getUncachableGitHubClient() {
  return new Octokit({ auth: getAccessToken() });
}

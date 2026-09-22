import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const parseRepo = async (repoUrl) => {
  logger.info('Parsing GitHub repo', { repoUrl });

  try {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }

    const [, owner, repo] = match;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Ethiroli-Backend',
        ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` })
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repoData = await response.json();

    const [treeResponse] = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Ethiroli-Backend',
          ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` })
        }
      }
    ).then(r => r.json());

    const projectData = {
      repoUrl,
      owner,
      repo,
      name: repoData.name,
      description: repoData.description,
      language: repoData.language,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      updatedAt: repoData.updated_at,
      tree: treeResponse.tree || [],
      totalFiles: treeResponse.truncated ? 'truncated' : treeResponse.tree?.length || 0
    };

    logger.info('GitHub repo parsed', { repoUrl, files: projectData.totalFiles });

    return {
      success: true,
      projectData
    };
  } catch (error) {
    logger.error('GitHub repo parsing failed', { repoUrl, error: error.message });
    return { success: false, error: error.message };
  }
};

export const fetchContributions = async (userId) => {
  logger.info('Fetching GitHub contributions', { userId });

  try {
    const [userRows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    const user = userRows[0];
    const preferences = user.preferences ? JSON.parse(user.preferences) : {};
    const githubUsername = preferences.github_username;

    if (!githubUsername) {
      return { success: false, message: 'GitHub username not linked to user', contributions: [] };
    }

    const response = await fetch(`https://api.github.com/users/${githubUsername}/events/public`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Ethiroli-Backend',
        ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` })
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();

    const contributions = events.map(event => ({
      type: event.type,
      repo: event.repo?.name,
      created_at: event.created_at,
      payload: event.payload
    }));

    logger.info('GitHub contributions fetched', { userId, count: contributions.length });

    return {
      success: true,
      userId,
      githubUsername,
      contributions,
      count: contributions.length
    };
  } catch (error) {
    logger.error('GitHub contributions fetch failed', { userId, error: error.message });
    return { success: false, error: error.message, contributions: [] };
  }
};

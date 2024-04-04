/* eslint-disable no-template-curly-in-string */
module.exports = {
  branches: [
    'main',
    '+([0-9])?(.{+([0-9]),x}).x',
    {
      name: '([A-Z]+)-([0-9]+)?(-([A-Za-z0-9-]+))',
      prerelease: 'dev-${name.toLowerCase()}',
      channel: 'dev',
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { breaking: true, release: 'major' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'chore', release: 'patch' },
          { type: 'ci', release: false },
          { type: 'test', release: false },
          { type: 'style', release: false },
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        linkCompare: true,
        writerOpts: {
          commitsSort: ['scope', 'subject'],
        },
      },
    ],
  ],
}

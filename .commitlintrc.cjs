module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^"?(\w*)\((\S*)\):\s(\w+)(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'chore', 'ci', 'test', 'style'],
    ],
  },
  ignores: [(commit) => commit.includes('Merge pull request #')],
}

module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^"?(\w*)\((([a-zA-Z]{1,5})-\d+)\):\s(\w+)(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'scope-case': [2, 'always', 'upper-case'],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'refactor', 'chore', 'ci', 'test', 'style']],
  },
  ignores: [(commit) => commit.includes('Merge pull request #')],
}

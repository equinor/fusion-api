module.exports = {
  mode: 'modules',
  name: 'Fusion Core',
  out: 'docs/html',
  theme: 'node_modules/typedoc-neo-theme/bin/default',
  excludePrivate: true,
  readme: 'README.md',
  exclude: ['**/node_modules/**', '**/*.spec.ts'],
  plugin: [
    'typedoc-plugin-lerna-packages',
    'typedoc-neo-theme'
  ],
  source: [{
    path: "https://github.com/equinor/fusion-api//blob/master/packages/",
    line: "L"
  }]
}

const config = require('./typedoc');

config.out = 'docs/markdown';
config.plugin.push('typedoc-plugin-markdown');

module.exports = config;

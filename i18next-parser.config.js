module.exports = {
  locales: ['en', 'zh', 'ko'],
  output: 'prompt-enhancer/src/locales/$LOCALE/translation.json',
  input: [
    'prompt-enhancer/src/**/*.{js,jsx,ts,tsx}',
  ],
  defaultValue: '',
  useKeysAsDefaultValue: false,
  keySeparator: false,
  namespaceSeparator: false,
  createOldCatalogs: false,
  sort: true,
}; 
module.exports = {
  '*.{json,html,md,yaml}': ['prettier --write', 'git add'],
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint', 'git add'],
  // 必须从 package.json 搬到这里，不然会无法校验
  '*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};

import { createSrcAndTests, rootDir, useFile } from './utils';
import { type Config, RepoType } from './pkg-init';
import { capitalize } from '@tool-pack/basic';
import { execa } from 'execa';
import * as Fs from 'fs';

const paths = {
  pnpmWorkspace: rootDir('pnpm-workspace.yaml'),
  tsconfig: rootDir('tsconfig.json'),
  typedoc: rootDir('typedoc.json'),
  pkgs: rootDir('packages'),
  src: rootDir('src'),
};
const mono = {
  createPnpmWorkspace() {
    const PnpmWorkspaceContent = `
packages:
  # all packages in subdirs of packages/ and components/
  - 'packages/**'
  # exclude packages that are inside test directories
  - '!**/tests/**'
  - '!**/test/**'
`.trim();
    Fs.writeFileSync(paths.pnpmWorkspace, PnpmWorkspaceContent);
  },
  updateTsconfig() {
    const [tsconfigContent, setTsconfig] = useFile(paths.tsconfig);
    setTsconfig(
      tsconfigContent
        .replace(
          /("include": \[)/,
          `$1
    "packages/*/src",
    "packages/*/__tests__",`,
        )
        .trim(),
    );
  },
  newPkg() {
    execa('npm', ['run', 'pkg:new'], { stdio: 'inherit' });
  },
  createPkgsDir() {
    Fs.mkdirSync(paths.pkgs);
  },
};
const multi = {
  updatePkg(config: Config) {
    const [pkgJson, updatePkg] = useFile(rootDir('package.json'), true);

    pkgJson['main'] = `dist/${config.name}.cjs.js`;
    pkgJson['module'] = `dist/${config.name}.esm-bundler.js`;
    pkgJson['types'] = `dist/${config.name}.d.ts`;
    pkgJson['exports'] = {
      '.': {
        import: {
          types: `./dist/${config.name}.d.ts`,
          node: `./dist/${config.name}.cjs.js`,
          // default 必须在最后面，否则某些打包工具会报错
          default: `./dist/${config.name}.esm-bundler.js`,
        },
        require: {
          types: `./dist/${config.name}.d.ts`,
          default: `./dist/${config.name}.cjs.js`,
        },
      },
    };
    pkgJson['buildOptions'] = {
      formats: ['esm-bundler', 'esm-browser', 'cjs', 'global'],
      name: capitalize(pkgJson['name']),
    };
    pkgJson['publishConfig'] = {
      registry: 'https://registry.npmjs.org/',
      access: 'public',
    };
    updatePkg(pkgJson);
  },
  updateApiExtractor() {
    const [apiJson, updateApiJson] = useFile(rootDir('api-extractor.json'), true);

    apiJson['mainEntryPointFilePath'] = './dist/src/index.d.ts';
    apiJson['dtsRollup'] = {
      publicTrimmedFilePath: './dist/<unscopedPackageName>.d.ts',
      enabled: true,
    };
    updateApiJson(apiJson);
  },
};

export async function setRepo(config: Config) {
  const [typedocJson, updateTypedoc] = useFile(paths.typedoc, true);
  typedocJson['navigationLinks'].GitHub = config.git.replace(/\.git$/, '');
  if (config.repoType === RepoType.mono) {
    // 1.设置pnpm-workspace.yaml
    mono.createPnpmWorkspace();

    // 2.设置tsconfig.json
    mono.updateTsconfig();

    // 3.生成packages目录
    mono.createPkgsDir();

    // 4.设置typedoc.json
    typedocJson['entryPointStrategy'] = 'packages';
    updateTypedoc(typedocJson);

    // 5.新增repo
    mono.newPkg();
    return;
  }

  typedocJson['name'] = config.name;
  typedocJson['entryPoints'] = ['src/index.ts'];
  updateTypedoc(typedocJson);

  // 更新package.json
  multi.updatePkg(config);

  // 更新api-extractor.json
  multi.updateApiExtractor();

  // 生成src、测试目录及其文件
  createSrcAndTests(rootDir(), config.name);
}

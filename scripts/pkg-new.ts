import * as path from 'path';
import { prompt } from 'enquirer';
import chalk from 'chalk';
import * as fs from 'fs';
import { toCamel } from '@tool-pack/basic';
import { createSrcAndTests, getGitUrl, useFile } from './utils';
import rootPkg from '../package.json';

const pkgsPath = path.resolve(__dirname, '../packages');

async function getConfig() {
  const config = {
    name: '',
    pkgName: '',
    umdName: '',
    deps: [],
    formats: [],
    private: false,
    description: '',
    keywords: '',
  };

  ({ value: config.name } = await prompt<{ value: string }>({
    type: 'input',
    name: 'value',
    message: '目录名(dirName)',
    required: true,
    validate(value) {
      if (fs.existsSync(path.resolve(pkgsPath, value))) {
        return '目录已存在！';
      }
      return true;
    },
  }));

  const reply = await prompt([
    {
      type: 'input',
      name: 'pkgName',
      message: '包名(pkgName)',
      initial: `@${rootPkg.name}/${config.name}`,
      required: true,
    },
    {
      type: 'input',
      name: 'umdName',
      message: '全局umd名(umdName)',
      initial: toCamel(rootPkg.name, '-') + toCamel(config.name, '-', true),
      required: true,
    },
    {
      type: 'input',
      name: 'description',
      message: '项目描述(description)',
      required: true,
    },
    {
      type: 'input',
      name: 'keywords',
      message: '关键词(keywords)',
      initial: config.name.split('-').join(','),
      required: true,
    },
    {
      type: 'confirm',
      name: 'private',
      message: '是否私有(private)',
      initial: false,
      required: true,
    },
  ]);

  Object.assign(config, reply);

  const deps = (fs.existsSync(pkgsPath) ? fs.readdirSync(pkgsPath) : []).map((pkg) =>
    path.basename(pkg),
  );

  if (deps.length) {
    ({ deps: config.deps } = await prompt({
      type: 'multiselect',
      name: 'deps',
      message: '选择依赖(deps)(按空格键选中/取消，enter键确定)',
      choices: deps,
    }));
  }

  const formatsChoices = ['esm-bundler', 'esm-browser', 'cjs', 'global'];

  if (!config.private) {
    ({ formats: config.formats } = await prompt({
      type: 'multiselect',
      name: 'formats',
      message: '选择打包类型(formats)(按空格键选中/取消，enter键确定)',
      choices: formatsChoices,
      initial: formatsChoices as any,
    }));
  }

  console.log('\n');
  step(JSON.stringify(config, null, 2));
  console.log('\n');
  const { confirm } = await prompt<{ confirm: boolean }>({
    type: 'confirm',
    name: 'confirm',
    message: '确认',
    initial: false,
    required: true,
  });

  if (!confirm) throw 'cancel';

  return config;
}

const step = (msg: string) => console.log(chalk.cyan(msg));

function createPackageJson(pkgPath: string, config: Awaited<ReturnType<typeof getConfig>>) {
  // 拼接package.json
  const gitUrl = getGitUrl();
  const gitUrlWithoutGit = gitUrl.replace(/^\.git$/, '');
  const buildOptions = config.private
    ? ''
    : `
  "main": "dist/${config.name}.cjs.js",
  "module": "dist/${config.name}.esm-bundler.js",
  "types": "dist/${config.name}.d.ts",
  "exports": {
    ".": {
      "import": {
        "node": "./dist/${config.name}.cjs.js",
        "default": "./dist/${config.name}.esm-bundler.js"
      },
      "require": "./dist/${config.name}.cjs.js"
    }
  },
  "buildOptions": {
    "name": "${config.umdName}",
    "formats": ${JSON.stringify(config.formats)}
  },
  "typedoc": {
    "entryPoint": "./src/index.ts",
    "readmeFile": "./README.md",
    "displayName": "${rootPkg.name}/${config.name}",
    "tsconfig": "../../tsconfig.json"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  `;
  const pkgContent = `
{
  "name": "${config.pkgName}",
  "version": "${rootPkg.version}",
  "description": "${config.description}",
  ${buildOptions}
  "keywords": ${JSON.stringify(config.keywords.split(','))},
  "files": [
    "index.js",
    "index.mjs",
    "dist"
  ],
  "repository": {
    "type": "git",
    "url": "git+${gitUrl}"
  },
  "scripts": {
    "apie": "api-extractor run"
  },
  "dependencies": ${JSON.stringify(
    config.deps.reduce((prev, cur) => {
      prev[`@${rootPkg.name}/${cur}`] = rootPkg.version;
      return prev;
    }, {} as Record<string, string>),
  )},
  "author": "dyh",
  "license": "MIT",
  "bugs": {
    "url": "${gitUrlWithoutGit}/issues"
  },
  "homepage": "${gitUrlWithoutGit}/tree/master/packages/${config.name}"
}
  `.trim();
  console.log(pkgContent);
  // 写入
  fs.writeFileSync(
    path.resolve(pkgPath, 'package.json'),
    JSON.stringify(JSON.parse(pkgContent), null, 2),
  );
}
function createApiExtractorJson(pkgPath: string, config: Awaited<ReturnType<typeof getConfig>>) {
  if (config.private) return;
  const apiExtContent = {
    extends: '../../api-extractor.json',
    mainEntryPointFilePath: './dist/packages/<unscopedPackageName>/src/index.d.ts',
    dtsRollup: {
      publicTrimmedFilePath: './dist/<unscopedPackageName>.d.ts',
    },
  };
  fs.writeFileSync(
    path.resolve(pkgPath, 'api-extractor.json'),
    JSON.stringify(apiExtContent, null, 2),
  );
}
function createReadme(pkgPath: string, config: Awaited<ReturnType<typeof getConfig>>) {
  const mdContent = `
# ${config.pkgName}  
${config.description}
    `.trim();
  fs.writeFileSync(path.resolve(pkgPath, 'README.md'), mdContent);
}

function updateTypedocJson(config: Awaited<ReturnType<typeof getConfig>>) {
  if (config.private) return;
  const [typedocConfig, setFile] = useFile(path.resolve(__dirname, '../typedoc.json'), true);
  if (!typedocConfig['entryPoints']) typedocConfig['entryPoints'] = [];
  typedocConfig['entryPoints'].push('packages/' + config.name);
  setFile(typedocConfig);
}

async function setup() {
  try {
    const { start } = await prompt<{ start: boolean }>({
      type: 'confirm',
      name: 'start',
      message: '是否开始添加child package？',
      initial: false,
      required: true,
    });

    if (!start) return;

    const config = await getConfig();

    const pkgPath = path.resolve(pkgsPath, config.name);

    // 1.生成pkg目录
    step('生成pkg目录');
    if (!fs.existsSync(pkgsPath)) {
      fs.mkdirSync(pkgsPath);
    }
    fs.mkdirSync(pkgPath);

    // 2.生成package.json
    step('生成package.json');
    createPackageJson(pkgPath, config);

    // 创建api-extractor.json
    step('生成api-extractor.json');
    createApiExtractorJson(pkgPath, config);

    // 创建README.md
    step('创建README.md');
    createReadme(pkgPath, config);

    // 创建src目录并添加__tests__目录
    step('创建src目录并添加__tests__目录');
    createSrcAndTests(pkgPath, config.pkgName);

    step('修改typedoc配置');
    updateTypedocJson(config);

    step('finish');
  } catch (e) {
    console.log(e);
  }
}
setup();

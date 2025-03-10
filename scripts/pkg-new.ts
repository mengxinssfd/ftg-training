import { createSrcAndTests, getGitUrl, useFile } from './utils';
import { capitalize, camelCase } from '@tool-pack/basic';
import rootPkg from '../package.json';
import { prompt } from 'enquirer';
import * as path from 'path';
import chalk from 'chalk';
import * as fs from 'fs';

const pkgsPath = path.resolve(__dirname, '../packages');

async function getConfig() {
  const config = {
    description: '',
    private: false,
    keywords: '',
    pkgName: '',
    umdName: '',
    formats: [],
    name: '',
    deps: [],
  };

  ({ value: config.name } = await prompt<{ value: string }>({
    validate(value) {
      if (fs.existsSync(path.resolve(pkgsPath, value))) {
        return '目录已存在！';
      }
      return true;
    },
    message: '目录名(dirName)',
    required: true,
    type: 'input',
    name: 'value',
  }));

  const reply = await prompt([
    {
      initial: `@${rootPkg.name}/${config.name}`,
      message: '包名(pkgName)',
      name: 'pkgName',
      required: true,
      type: 'input',
    },
    {
      initial: camelCase(rootPkg.name) + capitalize(config.name),
      message: '全局umd名(umdName)',
      name: 'umdName',
      required: true,
      type: 'input',
    },
    {
      message: '项目描述(description)',
      name: 'description',
      required: true,
      type: 'input',
    },
    {
      initial: config.name.split('-').join(','),
      message: '关键词(keywords)',
      name: 'keywords',
      required: true,
      type: 'input',
    },
    {
      message: '是否私有(private)',
      type: 'confirm',
      name: 'private',
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
      message: '选择依赖(deps)(按空格键选中/取消，enter键确定)',
      type: 'multiselect',
      choices: deps,
      name: 'deps',
    }));
  }

  const formatsChoices = ['esm-bundler', 'esm-browser', 'cjs', 'global'];

  if (!config.private) {
    ({ formats: config.formats } = await prompt({
      message: '选择打包类型(formats)(按空格键选中/取消，enter键确定)',
      initial: formatsChoices as any,
      choices: formatsChoices,
      type: 'multiselect',
      name: 'formats',
    }));
  }

  console.log('\n');
  step(JSON.stringify(config, null, 2));
  console.log('\n');
  const { confirm } = await prompt<{ confirm: boolean }>({
    type: 'confirm',
    name: 'confirm',
    initial: false,
    required: true,
    message: '确认',
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
    dtsRollup: {
      publicTrimmedFilePath: './dist/<unscopedPackageName>.d.ts',
    },
    mainEntryPointFilePath: './dist/packages/<unscopedPackageName>/src/index.d.ts',
    extends: '../../api-extractor.json',
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
      message: '是否开始添加child package？',
      type: 'confirm',
      initial: false,
      required: true,
      name: 'start',
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

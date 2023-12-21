import * as path from 'path';
import { prompt } from 'enquirer';
import * as semver from 'semver';
import chalk from 'chalk';
import * as fs from 'fs';
import { setRepo } from './set-repo';
import { cmdGet, getGitUrl, rootDir, useFile } from './utils';

export enum RepoType {
  mono = 'mono',
  multi = 'multi',
}

const rootPath = rootDir();
const rootPkgPath = path.resolve(rootPath, 'package.json');
const rootPkgJson = require(rootPkgPath);

export interface Config {
  name: string;
  description: string;
  author: string;
  keywords: string;
  git: string;
  version: string;
  license: string;
  repoType: RepoType;
}

async function getConfig() {
  const initConfig: Config = {
    name: path.basename(rootPath),
    description: rootPkgJson.description,
    author: cmdGet('git config user.name'),
    keywords: rootPkgJson.keywords.join(','),
    git: getGitUrl(),
    version: '0.0.0',
    license: rootPkgJson.license,
    repoType: RepoType.multi,
  };

  const reply = await prompt<Config>([
    // 1.获取项目名称
    {
      type: 'input',
      name: 'name',
      initial: initConfig.name,
      message: '输入项目名称：',
    },
    // 2.获取版本号version
    {
      type: 'input',
      name: 'version',
      initial: initConfig.version,
      message: '输入版本号(version)：',
      validate(value) {
        // 校验版本号
        if (!semver.valid(value)) {
          return `invalid version: ${value}`;
        }
        return true;
      },
    },
    // 3.获取description
    {
      type: 'input',
      name: 'description',
      initial: initConfig.description,
      message: '输入项目描述(description)：',
    },
    // 4.获取keywords
    {
      type: 'input',
      name: 'keywords',
      initial: initConfig.keywords,
      message: '输入关键词(keywords)：',
    },
    // 5.获取author
    {
      type: 'input',
      name: 'author',
      initial: initConfig.author,
      message: '输入作者(author)：',
    },
    // 6.获取license
    {
      type: 'input',
      name: 'license',
      initial: initConfig.license,
      message: '输入license：',
    },
    // 7.repo类型
    {
      type: 'select',
      name: 'repoType',
      initial: RepoType.multi as any,
      message: '选择repo类型：',
      choices: [{ name: RepoType.mono }, { name: RepoType.multi }],
    },
  ]);

  const config = { ...initConfig, ...reply };

  console.log(chalk.green(JSON.stringify(config, null, 2)));

  const { confirm } = await prompt<{ confirm: string }>({
    type: 'confirm',
    name: 'confirm',
    message: '是否确认',
  });

  if (!confirm) return Promise.reject('cancel');

  return config;
}
async function setup() {
  try {
    const { start } = await prompt<{ start: boolean }>({
      type: 'confirm',
      name: 'start',
      message: '是否开始初始化？',
      initial: false,
      required: true,
    });
    if (!start) return;

    console.log(chalk.cyan('初始化package.json开始...'));
    const config = await getConfig();
    //  console.log(config);
    // 3.根据description填写README.md
    // 5.获取远程git地址

    // 设置项目名称
    rootPkgJson.name = config.name;
    // 设置版本号version
    rootPkgJson.version = config.version;
    // 设置description
    rootPkgJson.description = config.description;
    // 设置keywords
    rootPkgJson.keywords = config.keywords.trim().split(',');
    // 设置author
    rootPkgJson.author = config.author;
    // 设置git
    rootPkgJson.repository.url = 'git+' + config.git;
    rootPkgJson.bugs.url = config.git.replace('.git', '/issues');
    rootPkgJson.homepage = config.git.replace('.git', '#readme');

    const LibStarterName = 'lib-starter';
    // 移除lib-starter相关的scripts
    for (const key in rootPkgJson.scripts) {
      if (key.startsWith(LibStarterName)) delete rootPkgJson.scripts[key];
    }

    fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkgJson, null, 2) + '\n');

    console.log(chalk.cyan('初始化package.json完成...'));

    console.log(chalk.cyan('初始化repo开始...'));
    setRepo(config);
    console.log(chalk.cyan('初始化repo完成...'));

    // 移除lib-starter的ci
    const [ci, updateCi] = useFile(path.resolve(__dirname, '../.github/workflows/ci.yml'));
    updateCi(ci.replace(new RegExp(`\\s*- run: npm run ${LibStarterName}.+\n`, 'g'), '\n'));

    // 移除lib-starter相关scripts
    const scriptsPath = path.resolve(__dirname, '../scripts');
    const scripts = fs.readdirSync(scriptsPath);
    scripts.forEach((script) => {
      const filename = path.basename(script);
      const filepath = path.resolve(scriptsPath, script);
      if (filename.startsWith(LibStarterName)) fs.rmSync(filepath);
    });
  } catch (e) {
    console.log(e);
  }
}
setup();

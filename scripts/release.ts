import * as path from 'path';
import * as fs from 'fs';
import { prompt } from 'enquirer';
import { execa } from 'execa';
import * as semver from 'semver';
import chalk from 'chalk';
import type { ReleaseType } from 'semver';
import { isMonoRepo, rootDir } from './utils';

const rootPkgJson = require('../package.json');
const args = require('minimist')(process.argv.slice(2));

const npmTool = 'pnpm';
const bin = (name: string) => path.resolve(__dirname, '../node_modules/.bin/' + name);
const step = (msg: string) => console.log(chalk.cyan(msg));

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {{}} opts
 */
const exec = (
  bin: string,
  args: string[],
  opts: Record<string, any> = {
    /*execPath: path.resolve(__dirname, '../')*/
  },
) => execa(bin, args, { stdio: 'inherit', ...opts });

const getPkgPath = (pkg: string) => path.resolve(__dirname, `../packages/${pkg}`);
const actions = {
  lintCheck: () => exec(npmTool, ['check:eslint']),
  jestCheck: () => exec(bin('jest'), ['--no-cache']),
  build: () => exec(npmTool, ['build']),
  updateVersions(pkgs: string[], version: string) {
    function updateDeps(json: Record<string, any>, depType: string, version: string) {
      const dep = json[depType];
      for (const k in dep) {
        if (k.startsWith('@' + rootPkgJson.name)) {
          console.log(chalk.yellow(`${json['name']} -> ${depType} -> ${k}@${version}`));
          dep[k] = version;
        }
      }
    }
    function updatePackage(pkgPath: string, version: string) {
      const file = fs.readFileSync(pkgPath).toString();
      const json = JSON.parse(file);
      json.version = version;
      updateDeps(json, 'devDependencies', version);
      updateDeps(json, 'dependencies', version);
      updateDeps(json, 'peerDependencies', version);
      fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2));
    }
    for (const pkg of pkgs) {
      updatePackage(path.resolve(getPkgPath(pkg), 'package.json'), version);
    }
    updatePackage(path.resolve(__dirname, `../package.json`), version);
  },
  async release(config: Config) {
    async function publishPkg(pkgPath: string) {
      const json = JSON.parse(fs.readFileSync(path.resolve(pkgPath, 'package.json'), 'utf-8'));
      if (json.private) return;

      /*let releaseTag = null;
      if (config.tag) {
        releaseTag = config.tag;
      } else if (config.targetVersion.includes('alpha')) {
        releaseTag = 'alpha';
      } else if (config.targetVersion.includes('beta')) {
        releaseTag = 'beta';
      } else if (config.targetVersion.includes('rc')) {
        releaseTag = 'rc';
      }*/

      step(`Publishing ${json.name}...`);
      try {
        await exec('npm', ['publish', '--access=public'], { cwd: pkgPath, stdio: 'pipe' });
        console.log(chalk.green(`Successfully published ${json.name}@${config.targetVersion}`));
      } catch (e: any) {
        if (e.stderr.match(/previously published/)) {
          console.log(chalk.red(`Skipping already published: ${json.name}`));
        } else {
          throw e;
        }
      }
    }
    if (isMonoRepo)
      for (const pkg of config.pkgs) {
        if (config.skippedPackages.includes(pkg)) continue;
        await publishPkg(getPkgPath(pkg));
      }
    else await publishPkg(rootDir());
  },
  genChangeLog: () => exec(npmTool, ['changelog']),
  async gitCommit(targetVersion: string) {
    const { stdout } = await exec('git', ['diff'], { stdio: 'pipe' });
    if (stdout) {
      step('\nCommitting changes...');
      await exec('git', ['add', '-A']);
      await exec('git', ['commit', '-m', `release: v${targetVersion}`]);
    } else {
      console.log('No changes to commit.');
    }
  },
  async gitPush(targetVersion: string) {
    // push to GitHub
    await exec('git', ['tag', `v${targetVersion}`]);
    await exec('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
    await exec('git', ['push']);
  },
};

interface Config {
  pkgs: string[];
  targetVersion: string;
  skipTest: boolean;
  skipBuild: boolean;
  currentVersion: string;
  preId: string;
  skippedPackages: string[];
  tag: string;
}
const baseConfig: Config = {
  pkgs: isMonoRepo ? fs.readdirSync(path.resolve(__dirname, '../packages')) : [],
  targetVersion: args._[0],
  skipTest: args.skipTest,
  skipBuild: args.skipBuild,
  currentVersion: rootPkgJson.version,
  // semver.prerelease('1.2.3-alpha.3') -> [ 'alpha', 3 ]
  preId: args.preid || semver.prerelease(rootPkgJson.version)?.[0],
  skippedPackages: [],
  tag: args.tag,
};

const inc = (i: ReleaseType) => semver.inc(baseConfig.currentVersion, i, baseConfig.preId);

async function getVersion(preId: string, currentVersion: string) {
  let targetVersion;
  const versionIncrements: ReleaseType[] = [
    'patch',
    'minor',
    'major',
    ...(preId ? (['prepatch', 'preminor', 'premajor', 'prerelease'] as const) : []),
  ];
  const { release } = await prompt<{ release: string }>([
    {
      type: 'select',
      name: 'release',
      message: `选择发布版本(当前v${rootPkgJson.version})`,
      choices: versionIncrements
        .map<{ message: string; name: string; hint: string }>((i) => {
          const version = inc(i) as string;
          return {
            message: i,
            name: version,
            hint: 'v' + version,
          };
        })
        .concat([{ message: `custom`, name: 'custom', hint: '' }]),
    },
  ]);
  if (release === 'custom') {
    ({ version: targetVersion } = await prompt<{ version: string }>({
      type: 'input',
      name: 'version',
      message: `Input custom version, cur(v${rootPkgJson.version}):`,
      initial: currentVersion,
      validate(value) {
        // 校验版本号
        if (!semver.valid(value)) return `invalid version: ${value}`;
        if (semver.gte(rootPkgJson.version, value)) return '新版本号必须大于旧版本号';

        return true;
      },
    }));
  } else {
    targetVersion = release;
  }

  const { yes } = await prompt<{ yes: boolean }>({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    throw new Error(`select NO`);
  }
  return targetVersion;
}

async function getConfig() {
  const config = {
    ...baseConfig,
  };

  config.targetVersion ||= await getVersion(config.preId, config.currentVersion);

  return config;
}

async function setup() {
  console.log('start');

  const config = await getConfig();

  step('\nRunning tests...');
  if (!config.skipTest) {
    await actions.lintCheck();
    await actions.jestCheck();
  } else {
    console.log(`(skipped)`);
  }

  step('\nRunning update versions...');
  await actions.updateVersions(config.pkgs, config.targetVersion);

  step('\nRunning build...');
  if (!config.skipBuild) {
    await actions.build();
  } else {
    console.log(`(skipped)`);
  }

  // generate changelog
  step('\nGenerating changelog...');
  await actions.genChangeLog();

  // monorepo才需要重新install依赖
  if (isMonoRepo) {
    // update pnpm-lock.yaml
    step('\nUpdating lockfile...');
    await exec(npmTool, ['install', '--prefer-offline']);
  }

  step('\ngit commit...');
  await actions.gitCommit(config.targetVersion);

  // publish packages
  step('\nPublishing packages...');
  await actions.release(config);
  console.log(config);

  return config;
}

setup().then(
  async (config) => {
    // push to GitHub
    step('\nPushing to GitHub...');
    await actions.gitPush(config.targetVersion);
    console.log('end');
  },
  (e) => {
    console.log('error', e);
    actions.updateVersions(baseConfig.pkgs, baseConfig.currentVersion);
  },
);

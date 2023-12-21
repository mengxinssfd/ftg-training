import * as Path from 'path';
import chalk from 'chalk';
import { execa } from 'execa';
import { getTargets, fuzzyMatchTarget, rootDir, isMonoRepo } from './utils';
import Fse from 'fs-extra';
import minimist from 'minimist';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';

const rootPath = rootDir();

const allTargets = isMonoRepo ? getTargets() : [rootPath];

const args = minimist(process.argv.slice(2));
const targets = args._;
const formats = args['formats'] || args['f'];
const sourceMap = args['sourcemap'] || args['s'];
const isRelease = args['release'];
const buildTypes = args['t'] || args['types'] || isRelease;
const buildAllMatching = args['all'] || args['a'];

async function buildAll(targets: string[]) {
  await runParallel(require('os').cpus().length, targets, build);
}

async function runParallel(maxConcurrency: number, source: string[], iteratorFn: typeof build) {
  const ret = [];
  const executing: Promise<void>[] = [];
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (maxConcurrency <= source.length) {
      const e: Promise<void> = p.then(() => (executing.splice(executing.indexOf(e), 1), void 0));
      executing.push(e);
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

/**
 * @param {string} target
 * @return {Promise<void>}
 */
async function build(target: string) {
  const pkgDirPath = isMonoRepo ? rootDir(`packages/${target}`) : rootPath;
  const pkgJson = require(`${pkgDirPath}/package.json`);
  if (pkgJson.private) return;
  await Fse.remove(Path.resolve(pkgDirPath, 'dist'));

  const env = pkgJson.buildOptions?.env || 'production';

  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
        formats ? `FORMATS:${formats}` : ``,
        buildTypes ? `TYPES:true` : ``,
        sourceMap ? `SOURCE_MAP:true` : ``,
      ]
        .filter(Boolean)
        .join(','),
    ],
    { stdio: 'inherit' },
  );

  if (buildTypes && pkgJson.types) buildType(target, pkgDirPath, pkgJson);
}

async function buildType(target: string, pkgDirPath: string, pkgJson: Record<string, any>) {
  console.log(chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`)));

  // build types
  const extractorConfigPath = Path.resolve(pkgDirPath, `api-extractor.json`);
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath);
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (extractorResult.succeeded) {
    // concat additional d.ts to rolled-up dts
    const typesDir = Path.resolve(pkgDirPath, 'types');
    if (Fse.existsSync(typesDir)) {
      const dtsPath = Path.resolve(pkgDirPath, pkgJson['types']);
      const existing = await Fse.readFile(dtsPath, 'utf-8');
      const typeFiles: string[] = await Fse.readdir(typesDir);
      const toAdd = await Promise.all(
        typeFiles.map((file) => {
          return Fse.readFile(Path.resolve(typesDir, file), 'utf-8');
        }),
      );
      await Fse.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'));
    }
    console.log(chalk.bold(chalk.green(`API Extractor completed successfully.`)));
  } else {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`,
    );
    process.exitCode = 1;
  }

  const nsPath = Path.resolve(pkgDirPath, 'src/namespace.d.ts');
  if (Fse.existsSync(nsPath)) {
    const distNsPath = Path.resolve(pkgDirPath, 'dist/namespace.d.ts');
    console.log(chalk.bold(chalk.green(`copy '${nsPath}' to '${distNsPath}'`)));
    await Fse.copy(nsPath, distNsPath);
  }

  await Fse.remove(Path.resolve(pkgDirPath, isMonoRepo ? `dist/packages` : 'dist/src'));
}

async function run() {
  if (targets.length) {
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching));
  } else {
    await buildAll(allTargets);
  }
}

run();

import * as Path from 'path';
import pkgJson from '../package.json';
import { createSrcAndTests } from './utils';

// 给lib-starter创建src目录和__tests__目录
if (pkgJson.name === 'lib-starter') createSrcAndTests(Path.resolve(__dirname, '../'), pkgJson.name);

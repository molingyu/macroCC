import commander from 'commander';
import { macroCC } from './main';
import conf from '../package.json'

commander
  .version(conf.version)
  .command('rmdir <dir> [otherDirs...]')
  .action(function (dir, otherDirs) {
    console.log('rmdir %s', dir);
    if (otherDirs) {
      otherDirs.forEach(function (oDir) {
        console.log('rmdir %s', oDir);
      });
    }
  });

commander.parse(process.argv);
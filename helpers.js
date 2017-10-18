const Path = require('path');
const FS = require('fs-extra');
const execa = require('execa');
const ora = require('ora');
const Chalk = require('chalk');
const guessRootPath = require('guess-root-path');

/**
 * Take a list of dependencies and filter out any that are already in the package.json
 * @param {Array} dependencies 
 * @param {boolean} isDev 
 */
const onlyNewDependencies = (dependencies, isDev) => {
  try {
    const config = require(Path.join(guessRootPath(), 'package.json'));
    const deps = Object.keys(config[isDev ? 'devDependencies' : 'dependencies']);
    return dependencies.filter(dep => !deps.includes(dep) && dep !== null);
  } catch (ex) {
    // nothing
  }

  return dependencies;
};

/**
 * Install dependencies (only if needed)
 * @param {Array} dependencies
 * @param {Array} args
 */
const installDependencies = async (dependencies, args, log) => {
  log = log || console.log;
  args = args || [];
  dependencies = onlyNewDependencies(dependencies, args.includes('--save-dev'));

  if (dependencies.length === 0) return;

  let spinner = ora(SPINNER).start();
  spinner.text = Chalk.gray(
    'installing ' +
      dependencies.length +
      `${args.includes('--save-dev') ? ' development ' : ' '}dependenc${dependencies.length == 1 ? 'y' : 'ies'}`
  );

  args = ['install', '--silent', '--no-progress', '--prefer-local'].concat(dependencies).concat(args);
  await execa('npm', args);

  spinner.stop();
  dependencies.forEach(d => {
    log(Chalk.yellow('      npm'), d);
  });
};

/**
 * Get an array of all paths in a directory and its subdirectorys
 * @param {(string|Array<strong>)} basePath A directory to start in
 * @returns {Array<string>} The list of paths
 */
function getAllPaths() {
  const basePaths = Array.from(arguments);

  // If given a list of paths
  if (basePaths.length > 1) {
    return basePaths
      .reduce((all, current) => {
        return all.concat(getAllPaths(current));
      }, [])
      .sort((a, b) => {
        // Remove any base paths from a and b to get a proper sort
        basePaths.forEach(p => {
          a = a.replace(p + '/', '');
          b = b.replace(p + '/', '');
        });

        return a.localeCompare(b);
      });
  }

  return FS.readdirSync(basePaths[0]).reduce((all, current) => {
    const path = basePaths[0] + '/' + current;

    if (FS.statSync(path).isDirectory()) {
      return all.concat(getAllPaths(path));
    } else {
      return all.concat(path);
    }
  }, []);
}

const SPINNER = {
  color: 'yellow',
  spinner: {
    interval: 80,
    frames: [
      '⣏⠀⠀',
      '⡟⠀⠀',
      '⠟⠄⠀',
      '⠛⡄⠀',
      '⠙⣄⠀',
      '⠘⣤⠀',
      '⠐⣤⠂',
      '⠀⣤⠃',
      '⠀⣠⠋',
      '⠀⢠⠛',
      '⠀⠠⠻',
      '⠀⠀⢻',
      '⠀⠀⣹',
      '⠀⠀⣼',
      '⠀⠐⣴',
      '⠀⠘⣤',
      '⠀⠙⣄',
      '⠀⠛⡄',
      '⠠⠛⠄',
      '⢠⠛⠀',
      '⣠⠋⠀',
      '⣤⠃⠀',
      '⣦⠂⠀',
      '⣧⠀⠀'
    ].map(f => '     ' + f + ' ')
  }
};

module.exports = { installDependencies, getAllPaths, SPINNER };

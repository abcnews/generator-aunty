const Generator = require('yeoman-generator');
const FS = require('fs-extra');
const guessRootPath = require('guess-root-path');
const Chalk = require('chalk');
const requireg = require('requireg');
const Path = require('path');
const getAllPaths = require('get-all-paths');
const { installDependencies, SPINNER } = require('../../helpers');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { required: false });
    this.option('here', { description: 'Initialize project into current directory' });
    this.option('template', { description: 'Type of project (eg. basic, preact, react)' });
  }

  usage() {
    if (this.options.aunty) {
      return 'aunty new [options] [<name>]';
    } else {
      return super.usage();
    }
  }

  async prompting() {
    let prompts = [];

    if (this.options.here) {
      this.options.name = Path.basename(process.cwd());
    }

    if (!this.options.name) {
      prompts.push({
        type: 'input',
        name: 'name',
        message: 'What is your project called?',
        default: this.options.name || 'New Project'
      });
    }

    if (!this.options.template) {
      prompts.push({
        type: 'list',
        name: 'template',
        message: 'What type of project is it?',
        choices: [
          { name: 'Preact', value: 'preact' },
          { name: 'Basic', value: 'basic' },
          { name: 'React', value: 'react' },
          { name: 'Vue', value: 'vue' }
        ]
      });
    }

    if (prompts.length > 0) {
      const answers = await this.prompt(prompts);
      this.options = Object.assign({}, this.options, answers);
    }

    this.options.projectSlug = this.options.name
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[^0-9a-z\-\_]/g, '');

    if (this.options.here) {
      this.options.path = process.cwd();
    } else {
      this.options.path = process.cwd() + '/' + this.options.projectSlug;
    }
  }

  async configuring() {
    const directory = this.options.path;

    await FS.ensureDir(directory);
    process.chdir(directory);
    this.destinationRoot(directory);
    this.config.set('template', this.options.template);
  }

  writing() {
    const context = {
      projectName: this.options.name,
      projectSlug: this.options.projectSlug,
      projectType: this.options.template + '-app',
      authorName: this.user.git.name(),
      authorEmail: this.user.git.email()
    };

    const commonPath = this.templatePath(`_common`);
    const typePath = this.templatePath(`${this.options.template}`);
    const paths = getAllPaths(commonPath, typePath);

    paths.forEach(file => {
      this.fs.copyTpl(
        file,
        this.destinationPath(
          file
            .replace(`${commonPath}/`, '')
            .replace(`${typePath}/`, '')
            .replace('_.', '.')
        ),
        context
      );
    });
  }

  async install() {
    let auntyVersion = '7.6.1';
    try {
      auntyVersion = requireg('@abcnews/aunty/package.json').version;
    } catch (ex) {
      // Nothing
    }

    let dependencies = [];
    let devDependencies = [`@abcnews/aunty@${auntyVersion}`, 'jest'];

    switch (this.options.template) {
      case 'preact':
        devDependencies = devDependencies.concat([
          'preact-render-to-string',
          'html-looks-like',
          'babel-plugin-transform-react-jsx',
          'babel-preset-env'
        ]);
        dependencies = ['preact', 'preact-compat'];
        break;
      case 'react':
        devDependencies = devDependencies.concat(['react-test-renderer', 'babel-preset-env', 'babel-preset-react']);
        dependencies = ['react', 'react-dom'];
        break;
      case 'vue':
        devDependencies = devDependencies.concat(['vue-loader', 'vue-template-compiler', 'vue-server-renderer']);
        dependencies = ['vue'];
        break;
      case 'basic':
      default:
        devDependencies = devDependencies.concat(['babel-preset-env']);
    }

    await installDependencies(devDependencies, '--save-dev', this.log);
    await installDependencies(dependencies, '--save', this.log);
  }

  end() {
    const where = this.options.here ? 'the current directory' : `./${this.options.projectSlug}`;

    this.log('\n 👍', Chalk.bold(this.options.name), 'created in', Chalk.bold(where), '\n');
  }
};

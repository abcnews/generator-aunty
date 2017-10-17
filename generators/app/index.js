const Generator = require('yeoman-generator');
const FS = require('fs-extra');
const guessRootPath = require('guess-root-path');
const Chalk = require('chalk');
const requireg = require('requireg');
const { installDependencies, getAllPaths, SPINNER } = require('../../helpers');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { required: false });
  }

  async prompting() {
    let prompts = [];

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
          { name: 'React', value: 'react' }
        ]
      });
    }

    if (prompts.length > 0) {
      const answers = await this.prompt(prompts);
      this.options = Object.assign({}, this.options, answers);
    }

    this.options.projectSlug = this.options.name
      .toLowerCase()
      .replace(/\s/, '-')
      .replace(/[^0-9a-z\-\_]/, '');
    this.options.path = process.cwd() + '/' + this.options.projectSlug;
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
    let auntyVersion = '5.6.0';
    try {
      auntyVersion = requireg('@abcnews/aunty/package.json').version;
    } catch (ex) {
      // Nothing
    }

    let dependencies = [];
    let devDependencies = [`@abcnews/aunty@${auntyVersion}`, 'jest', 'babel-jest', 'imitation'];

    switch (this.options.template) {
      case 'preact':
        devDependencies = devDependencies.concat([
          'preact-render-to-string',
          'html-looks-like',
          'babel-plugin-transform-react-jsx',
          'babel-preset-es2015'
        ]);
        dependencies = ['preact', 'preact-compat'];
        break;
      case 'react':
        devDependencies = devDependencies.concat(['react-test-renderer', 'babel-preset-es2015', 'babel-preset-react']);
        dependencies = ['react', 'react-dom'];
        break;
      case 'basic':
      default:
      // Nothing
    }

    await installDependencies(devDependencies, '--save-dev', this.log);
    await installDependencies(dependencies, '--save', this.log);
  }

  end() {
    this.log('\n 👍', Chalk.bold(this.options.name), 'created in', Chalk.bold('./' + this.options.projectSlug), '\n');
  }
};

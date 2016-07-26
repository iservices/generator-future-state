'use strict';

const generators = require('yeoman-generator');
const fs = require('fs');

module.exports = generators.Base.extend({

  // introduction prompt
  initializing: function () {
    this.log('This utility will walk you through setting up a future state project in');
    this.log(this.destinationRoot());
    this.log('Press ^C at any time to quit.');
    this.log('');

    this.userInput = {};
  },

  // get the project configurations
  prompting: function () {
    const prompts = [
    { type: 'input',
      name: 'projectName',
      message: 'Enter the project name:',
      default: this.appname.replace(/ /g, '-')
    },
    { type: 'input',
      name: 'projectDescription',
      message: 'Enter the project description:',
      default: ''
    },
    { type: 'list',
      name: 'projectType',
      message: 'Select the project type:',
      choices: ['app server', 'api server', 'custom'],
      default: 'app server'
    },
    { type: 'checkbox',
      name: 'projectTypeCustomChoices',
      message: 'Select the components to include in your project:',
      choices: ['asset', 'bundle', 'lint', 'style', 'test', 'transform'],
      default: [],
      when: function (answers) { return answers.projectType === 'custom'; }
    },
    { type: 'confirm',
      name: 'includeExpress',
      message: 'Use Express HTTP server:',
      default: true
    },
    { type: 'confirm',
      name: 'includeFlux',
      message: 'Use Flux pattern for UI',
      default: true,
      when: function (answers) {
        switch (answers.projectType) {
          case 'app server':
            return true;
          case 'custom':
            const choices = answers.projectTypeCustomChoices;
            return choices.indexOf('bundle') > -1 && choices.indexOf('transform') > -1;
          default:
            return false;
        }
      }
    },
    { type: 'confirm',
      name: 'includeBootstrap',
      message: 'Use bootstrap styles:',
      default: true,
      when: function (answers) {
        switch (answers.projectType) {
          case 'app server':
            return true;
          case 'custom':
            const choices = answers.projectTypeCustomChoices;
            return choices.indexOf('style') > -1 && choices.indexOf('asset') > -1;
          default:
            return false;
        }
      }
    },
    { type: 'confirm',
      name: 'includeFontAwesome',
      message: 'Use font awesome icons:',
      default: true,
      when: function (answers) {
        switch (answers.projectType) {
          case 'app server':
            return true;
          case 'custom':
            const choices = answers.projectTypeCustomChoices;
            return choices.indexOf('style') > -1 && choices.indexOf('asset') > -1;
          default:
            return false;
        }
      }
    }];

    const done = this.async();
    this.prompt(prompts, function (answers) {
      this.userInput = answers;
      done();
    }.bind(this));
  },

  // create project files
  writing: function () {
    const values = {
      projectName: JSON.stringify(this.userInput.projectName),
      projectDescription: JSON.stringify(this.userInput.projectDescription),
      projectDependencies: [],
      projectDevDependencies: [],
      projectScripts: [],
      includeBootstrap: this.userInput.includeBootstrap,
      includeFontAwesome: this.userInput.includeFontAwesome,
      includeBrowserSync: false
    };

    let components = [];
    switch (this.userInput.projectType) {
      case 'app server':
        components = ['asset', 'bundle', 'lint', 'style', 'test', 'transform'];
        break;
      case 'api server':
        components = ['lint', 'test', 'transform'];
        break;
      case 'custom':
        components = this.userInput.projectTypeCustomChoices;
        break;
      default:
        break;
    }

    const buildScripts = [];
    const buildAppsScripts = [];
    const watchScripts = [];

    fs.mkdirSync(this.destinationPath('src/'));

    components.forEach(function (component) {
      switch (component) {
        case 'asset':
          fs.mkdirSync(this.destinationPath('src/public/'));
          values.projectDependencies.push('"build-asset": "^2.0.0"');
          const assetTasks = [];
          if (values.includeBootstrap) {
            values.projectScripts.push('"asset-bootstrap": "build-asset \\"node_modules/bootstrap-sass/assets/fonts/bootstrap/*.*\\" -i node_modules/bootstrap-sass/assets/fonts/bootstrap/ -o dist -n styles/fonts/bootstrap -m"');
            assetTasks.push('npm run asset-bootstrap');
          }
          if (values.includeFontAwesome) {
            values.projectScripts.push('"asset-fonts": "build-asset \\"node_modules/font-awesome/fonts/*.*\\" -i node_modules/font-awesome/fonts/ -o dist -n styles/fonts/font-awesome -m"');
            assetTasks.push('npm run asset-fonts');
          }
          values.projectScripts.push('"asset-public": "build-asset \\"src/public/**/*.*\\" -i src/public -o dist -n public -m"');
          assetTasks.push('npm run asset-public');
          values.projectScripts.push('"asset": "' + assetTasks.join(' && ') + '"');
          buildScripts.push('npm run asset');
          buildAppsScripts.push('npm run asset');
          watchScripts.push('npm run asset-public');
          break;
        case 'lint':
          this.fs.copy(
            this.templatePath('eslintrc.template'),
            this.destinationPath('.eslintrc'));
          values.projectDevDependencies.push('"build-lint": "^2.0.0"');
          values.projectScripts.push('"lint": "build-lint \\"src/**/*.js\\" \\"!src/public/**/*\\" \\"!src/styles/**/*\\" \\"!src/tests/fixtures/**/*\\""');
          break;
        case 'style':
          fs.mkdirSync(this.destinationPath('src/styles/'));
          values.projectDependencies.push('"build-style": "^2.0.0"');
          if (this.userInput.includeBootstrap) {
            values.includeBootstrap = true;
            values.projectDependencies.push('"bootstrap-sass": "^3.3.5"');
          }
          if (this.userInput.includeFontAwesome) {
            values.includeFontAwesome = true;
            values.projectDependencies.push('"font-awesome": "^4.4.0"');
          }
          values.projectScripts.push('"style": "build-style \\"src/styles/**/*.style.scss\\" -i src/styles -o dist -n styles -m"');
          buildScripts.push('npm run style');
          buildAppsScripts.push('npm run style');
          watchScripts.push('npm run style');
          break;
        case 'test':
          fs.mkdirSync(this.destinationPath('src/tests/'));
          values.projectDevDependencies.push('"build-test": "^2.0.0"');
          if (components.indexOf('transform') !== 0) {
            values.projectScripts.push('"unit-test": "build-test \\"lib/tests/**/*.spec.js\\" -c \\"lib/**/*.js\\" -c \\"!lib/tests/**/*.js\\" -c \\"!lib/apps/mocks/**/*.js\\" --lines 75"');
          } else {
            values.projectScripts.push('"unit-test": "build-test \\"src/tests/**/*.spec.js\\" -c \\"src/**/*.js\\" -c \\"!src/tests/**/*.js\\" -c \\"!src/apps/mocks/**/*.js\\" --lines 75"');
          }
          values.projectScripts.push('"test": "npm run transform && npm run unit-test"');
          values.projectScripts.push('"test-report": "npm run transform && npm run unit-test -- -f file"');
          break;
        case 'transform':
          fs.mkdirSync(this.destinationPath('src/local/'));
          values.projectDependencies.push('"build-transform": "^2.0.0"');
          values.projectScripts.push('"transform": "build-transform \\"src/**/*.[tj]s\\" -i src"');
          buildScripts.unshift('npm run transform');
          buildAppsScripts.unshift('npm run transform');
          watchScripts.push('npm run transform');
          break;
        case 'bundle':
          fs.mkdirSync(this.destinationPath('src/apps/'));
          fs.mkdirSync(this.destinationPath('src/apps/framework/'));
          values.projectDependencies.push('"build-bundle": "^2.0.0"');
          values.projectDevDependencies.push('"browser-sync": "^2.12.8"');
          values.projectScripts.push('"bundle": "build-bundle lib/apps -o dist -m"');
          values.projectScripts.push('"bundle-apps": "build-bundle lib/apps -o dist -m -e app"');
          buildScripts.push('npm run bundle');
          buildAppsScripts.push('npm run bundle-apps');
          watchScripts.push('npm run bundle');
          values.includeBrowserSync = true;
          break;
        default:
          break;
      }
    }.bind(this));

    if (buildScripts.length) {
      values.projectScripts.push('"build": "' + buildScripts.join(' && ') + '"');
      values.projectScripts.push('"postinstall": "npm run build"');
      values.projectScripts.push('"run": "npm run build && npm start"');
    }
    if (buildAppsScripts.length) {
      values.projectScripts.push('"build-apps": "' + buildAppsScripts.join(' && ') + '"');
      values.projectScripts.push('"run-apps": "npm run build-apps && npm start"');
    }
    if (watchScripts.length) {
      values.projectScripts.push('"watch-win32": "start /b ' + watchScripts.join(' -s -- -w & start /b ') + ' -s -- -w"');
      values.projectScripts.push('"watch-nix": "' + watchScripts.join(' -s -- -w & ') + ' -s -- -w"');
      values.projectScripts.push('"watch": "npm run watch-win32 -s || npm run watch-nix -s"');

      if (values.includeBrowserSync) {
        values.projectScripts.push('"watch-start": "nodemon -w ./lib -w ./dist -e \\"*.*\\"');
        values.projectScripts.push('"watch-browser-win32": "start /b npm run watch-start & start /b npm run watch -s & start /b browser-sync start -p localhost:3000 --port 3001 -f server.log"');
        values.projectScripts.push('"watch-browser-nix": "npm run watch-start & npm run watch -s & browser-sync start -p localhost:3000 --port 3001 -f server.log"');
        values.projectScripts.push('"watch-browser": "npm run watch-browser-win32 -s || npm run watch-browser-nix -s"');
      }
    }
    values.projectScripts.push('"start": "node ."');

    if (this.userInput.includeExpress) {
      values.projectDependencies.push('"express": "^4.13.4"');
    }

    if (this.userInput.includeFlux) {
      values.projectDependencies.push('"reng": "^1.0.0"');
    }

    if (this.userInput.includeExpress && this.userInput.includeFlux) {
      values.projectDependencies.push('"bundle-server": "^1.0.0"');
      values.projectDependencies.push('"compression": "^1.6.1"');
      values.projectDependencies.push('"throng": "^2.0.1"');
      values.projectDevDependencies.push('"jsdom": "^9.2.1"');
      values.projectDevDependencies.push('"nodemon": "^1.9.2"');
    }

    values.projectDependencies = values.projectDependencies.sort().join(',\n    ');
    values.projectDevDependencies = values.projectDevDependencies.sort().join(',\n    ');
    values.projectScripts = values.projectScripts.sort().join(',\n    ');

    this.fs.copyTpl(
      this.templatePath('package.template'),
      this.destinationPath('package.json'),
      values);

    if (values.includeBootstrap || values.includeFontAwesome) {
      this.fs.copyTpl(
        this.templatePath('mainStyle.template'),
        this.destinationPath('src/styles/main.style.scss'),
        values);
    }

    this.fs.copy(
      this.templatePath('gitignore.template'),
      this.destinationPath('.gitignore'));

    this.fs.copy(
      this.templatePath('slugignore.template'),
      this.destinationPath('.slugignore'));

    this.fs.copy(
      this.templatePath('README.template'),
      this.destinationPath('README.md'));

    this.fs.copy(
      this.templatePath('jsconfig.template'),
      this.destinationPath('jsconfig.json'));

    if (this.userInput.includeExpress && this.userInput.includeFlux) {
      this.fs.copy(
        this.templatePath('indexFluxExpress.template'),
        this.destinationPath('index.js'));
      this.fs.copy(
        this.templatePath('apps'),
        this.destinationPath('src/apps'));
      this.fs.copy(
        this.templatePath('tests'),
        this.destinationPath('src/tests'));
    } else if (this.userInput.includeExpress) {
      this.fs.copy(
        this.templatePath('indexExpress.template'),
        this.destinationPath('index.js'));
    } else {
      this.fs.copy(
        this.templatePath('index.template'),
        this.destinationPath('index.js'));
    }
  },

  // do npm installs
  install: function () {
    this.installDependencies({
      npm: true,
      bower: false,
      skipMessage: true
    });
  }

});

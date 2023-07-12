const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { existsSync, readdirSync, writeFileSync, mkdirSync, readFileSync } = require('fs');
const { resolve, relative, join } = require('path');

function die(message, ...args) {
  console.error(message, ...args);
  process.exit(1);
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function unique(arr) {
  const newArr = [];

  for (const a of arr) {
    if (!newArr.includes(a)) {
      newArr.push(a);
    }
  }

  return newArr;
}

class JPDBioWebpackPlugin {
  packageJson = require('./package.json');
  manifestJson = 'manifest.json';
  overwriteJson = 'manifest.overwrite.json';
  src = 'src';
  modules = 'src/modules';
  artifacts = './.artifacts';
  manifestKeys = [
    'name',
    'namespace',
    'version',
    'description',
    'author',
    'license',
    'match',
    'icon',
    'homepageURL',
    'releasesURL',
    'supportURL',
    'updateURL',
    'grant',
    'build',
    'output',
  ];

  constructor() {
    this.pluginName = this.constructor.name;
    this.root = __dirname;

    this.isBuild = process.env.npm_lifecycle_event === 'build';
    this.isWatch = process.env.npm_lifecycle_event === 'watch';

    this.manifest = this.loadManifest(this.packageJson, this.root);
    this.options = {};
    this.entry = undefined;
    this.buildCfg = this.manifest.output[process.env.npm_lifecycle_event];
  }

  apply(compiler) {
    this.options = compiler.options;

    this.entry = this.artifacts;
    this.options.entry.main.import = [];

    this.createEntryDir();
    this.parseManifest();
    this.parseBuildCfg();

    this.addMonkeys();

    this.runCopyPlugin(compiler);
    this.runDefinePlugin(compiler);
    this.runMergePlugin(compiler);
  }

  createEntryDir() {
    mkdirSync(this.entry, { recursive: true });
  }

  loadManifest(source, path) {
    const getContent = (path) => {
      return existsSync(path) ? require(path) : {};
    };
    const pickManifestData = (m) => {
      const obj = {};

      this.manifestKeys.forEach((key) => {
        if (m[key] !== undefined) {
          obj[key] = m[key];
        }
      });

      return obj;
    };

    const result = pickManifestData(source);
    const manifest = pickManifestData(getContent(resolve(path, this.manifestJson)));
    const overwrite = pickManifestData(getContent(resolve(path, this.overwriteJson)));

    // Pick grant data from source and either the overwrite or manifests new grant and merge them
    const grants = unique([result.grant ?? [], overwrite.grant ?? manifest.grant ?? []].flat());

    mergeDeep(result, manifest);
    mergeDeep(result, overwrite);

    result.grant = grants;

    return result;
  }

  parseManifest() {
    const { build } = this.manifest;

    if (!build?.length) die('Build artifacts not defined');

    if (build.length === 1) {
      const [b] = build;
      const res = this.resolveBuild(b);

      this.manifest = this.loadManifest(this.manifest, res);
      this.buildCfg = this.manifest.output[process.env.npm_lifecycle_event];

      this.addImport(res);
    } else
      build
        .map((b) => this.resolveBuild(b))
        .forEach((p) => {
          this.addImport(p);
        });
  }

  resolveBuild(build) {
    const sources = [this.src, this.modules];

    for (const source of sources) {
      const lookupPath = resolve(this.root, source, build);
      const indexJs = resolve(lookupPath, 'index.js');
      const indexTs = resolve(lookupPath, 'index.ts');

      if (existsSync(indexJs) || existsSync(indexTs)) return lookupPath;
    }

    die('Module %O not found', build);
  }

  parseBuildCfg() {
    this.options.output.filename = this.buildCfg.script;
    this.options.optimization.minimize = this.buildCfg.minimize;

    this.manifest.require =
      'file://' +
      resolve(this.options.output.path, this.options.output.filename).replace(/\\/g, '/');
  }

  addImport(file) {
    this.options.entry.main.import.push('./' + relative(this.root, file).replace(/\\/g, '/'));
  }

  runCopyPlugin(compiler) {
    if (this.buildCfg.assets) {
      new CopyPlugin({
        patterns: this.buildCfg.assets,
      }).apply(compiler);
    }
  }

  runDefinePlugin(compiler) {
    const obj = {};

    Object.keys(this.manifest).forEach((key) => {
      obj[`manifest.${key.toUpperCase()}`] = JSON.stringify(this.manifest[key]);
    });

    new DefinePlugin(obj).apply(compiler);
  }

  addMonkeys() {
    const path = resolve(this.root, this.artifacts);

    mkdirSync(path, { recursive: true });
    writeFileSync(join(path, 'build-bundle.js'), this.getBuildMonkey());
    writeFileSync(join(path, 'watch-bundle.js'), this.getWatchMonkey());
  }

  getBuildMonkey() {
    const pick = [
      'name',
      'namespace',
      'version',
      'description',
      'author',
      'license',
      'match',
      'icon',
      'homepageURL',
      'supportURL',
      'downloadURL',
      'updateURL',
      'grant',
    ];
    return this.getMonkeyScript(pick);
  }

  getWatchMonkey() {
    const pick = [
      'name',
      'namespace',
      'version',
      'description',
      'author',
      'license',
      'match',
      'icon',
      'homepageURL',
      'supportURL',
      'grant',
      'require',
    ];
    return this.getMonkeyScript(pick, 'Development');
  }

  getMonkeyScript(picks, nameOverwrite = undefined) {
    const script = ['// ==UserScript=='];
    let lKey = 0;

    picks.forEach((p) => {
      if (p.length > lKey) lKey = p.length;
    });

    picks.forEach((pick) => {
      let val = this.manifest[pick];

      // special case "name"
      if (pick === 'name' && nameOverwrite) {
        val = `${val} (${nameOverwrite})`;
      }

      const arVal = Array.isArray(val) ? val : [val];

      // special case "grant"
      if (pick === 'grant') {
        if (arVal.length === 0) {
          arVal.push('none');
        }
      }

      arVal
        .filter((v) => !!v?.length)
        .forEach((v) => {
          script.push(`// @${pick}${' '.repeat(lKey - pick.length)} ${v}`);
        });
    });

    return [...script, '// ==/UserScript=='].join('\n');
  }

  runMergePlugin(compiler) {
    compiler.hooks.afterEmit.tap(this.pluginName, () => {
      if (this.buildCfg.merge?.length) {
        const source = resolve(this.options.output.path, this.options.output.filename);
        const content = this.buildCfg.merge
          .map((f) => (f === 'script' ? source : resolve(this.root, f)))
          .reduce((l, r) => [l, readFileSync(r, 'utf-8')].join('\n'), '')
          .trim();

        writeFileSync(source, content);
      }
    });
  }
}

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new JPDBioWebpackPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, '.dist'),
    iife: false,
    clean: true,
  },
  optimization: {
    usedExports: true,
  },
};

// pull in package json to get version/description info
var pkg = require("./package.json");

// cli iife
var cli = (function () {

  // local variables
  var _name = pkg.name, 
      _title = 'CLI Helper Object', 
      _desc = pkg.description,
      _file_count = 0;

  // initialize local args from node args, removing node and script name
  var args = process.argv.slice(2);

  // params object returned from cli.ready()
  var params = {};

  // array of options supported -- initialize with help and version options.
  var options = [];
  options.push({ name: '--help', alias: '-h', value: '<none>', desc: 'Get help' });
  options.push({ name: '--version', alias: '-v', value: '<none>', desc: 'Get version' });

  // configuration setters - descriptive info name, title, desc 
  function name(to) {
    _name = to;
    return me;
  }
  function title(to) {
    _title = to;
    return me;
  }
  function desc(to) {
    _desc = to;
    return me;
  }

  // configuration setter - number of files to expect on the command line
  function files(count) {
    _file_count = count;
    return me;
  }

  // configure and parse a flag at the same time
  function flag(name, alias=name.substr(0,1), desc = 'No help available') {
    let opt = { name: `--${name}`, alias: `-${alias}`, value: '<none>', desc: desc };
    options.push(opt);
    let idx = args.findIndex(function(el) { return el === opt.name || el === opt.alias });
    if (idx != -1) {
      params[name] = true;
      args.splice(idx,1);
    }
    else {
      params[name] = false;
    }
    return me;
  }

  // configure and parse a param at the same time
  function param(name, alias=name.substr(0,1), def = false, desc = 'No help available') {
    let v = (def === false) ? '<value>' : `<'${def}'>`;
    var opt = { name: `--${name}`, alias: `-${alias}`, value: v, desc: desc };
    options.push(opt);
    let idx = args.findIndex(function(el) { return el === opt.name || el ===  opt.alias});
    if (idx != -1) {
      params[name] = args[idx + 1];
      args.splice(idx,2);
    }
    else {
      params[name] = def;
    }
    return me;
  }

  // formats help -- only invokable using the -h or --help flags
  function help() {
    console.log(`\n${_name} - ${_title}\n\n${_desc}\n\nParameters:`);
    if (_file_count > 0) {
      console.log(` filename (${_file_count} files)`);
    }
    options.forEach(function(opt) {
      console.log(` ${opt.alias}, ${opt.name} ${opt.value} \t ${opt.desc}`);
    });
    console.log();
    return me;
  }

  // ready the params and call the user-defined callback
  function ready(cb) {

    // respond to internally managed flags
    if (args.findIndex(function(el) { return el === '-v' || el === '--version' }) != -1) {
      console.log(pkg.version);
      return me;
    }
    if (args.findIndex(function(el) { return el === '-h' || el === '--help' }) != -1) {
      help();
      return me;
    }

    // set file params last, after all other options have been removed from args array
    if (_file_count > 0) {
      if (_file_count === 1) {
        params['file'] = args[0];
        args.shift();
      }
      else {
        params['files'] = args.splice(0, _file_count);
      }
    }
    if (args.length > 0) {
      console.log("\nOops! Something isn't right.\n There are unrecognized parameters.\n Please use --help for more information.\n");
    }
    else {
      cb(params);
    }
    return me;
  }

  var me = {
    name: name,
    title: title,
    desc: desc,
    files: files,
    flag: flag,
    param: param,
    ready: ready 
  }

  return me;

}());

module.exports = cli;

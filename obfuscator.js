const JSObf = require('javascript-obfuscator'); // Obfuscator

// File Utils
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const fs = require('fs');

// Obfuscator Options
const options = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  numbersToExpressions: true,
  simplify: false,
  stringArrayShuffle: true,
  splitStrings: true,
  stringArrayThreshold: 1
};

// Obfuscate the code
function obfuscate(code, time) {
  // obfuscate 'time' time(s)
  let res = code;
  for (let i = 0; i < time; i++) {
    res = JSObf.obfuscate(code, options).getObfuscatedCode();
  }
  return res;
}

//     DIRECTORIES & OUTPUT
// Set all directories need to be obfuscated to Array `dirs`
// E.g: 
// * ~/src/*.js 
// * ~/src/**/*.js
// * ~/public/**/*
// '~' is current project path.
// '*' is any files (Add suffix such as .js, .ts, .py, ... to filter files with these)
// '**' is any dirs/folders
//
// Set output path for obfuscated code to variable `ObfuscatedPath`
// '~' is current project path

// Example code
const ObfuscatedPath = '~/dist'; // Obfuscated code will be created in ./dist/path/to/file/ (origin code)
const dirs = [
  '~/src/*.js', // all .JS file in ./src
  '~/src/**/*.js' // all .JS file in all folders in ./src
];

// Set obfuscate times
const ObfuscateTimes = 5;

// DO NOT TOUCH THE CODE BELOW
if(!ObfuscatedPath || ObfuscatedPath == '') return console.log(`[OBFUSCATOR] Please enter a valid obfuscated output path`);
if(!dirs || dirs.length == 0) return console.log(`[OBFUSCATOR] Please enter directories to obfuscate them`);
if(!ObfuscateTimes || ObfuscateTimes <= 0) return console.log(`[OBFUSCATOR] Please enter a valid integer > 0`);
dirs.forEach(async (dir) => {
  const Files = await globPromise(`${dir.replaceAll('~', `${process.cwd()}`)}`);
  Files.map(async (File) => {
    const fileOutput = File.replaceAll(`${process.cwd().replaceAll('\\', '/')}`, `${ObfuscatedPath.replaceAll('~', `${process.cwd().replaceAll('\\', '/')}`)}`);
    let fileDir = fileOutput.split('/');
    fileDir.pop();
    fileDir = fileDir.join('/');
    if (!fs.existsSync(fileDir))
      fs.mkdirSync(fileDir, { recursive: true });
    fs.writeFileSync(fileOutput, obfuscate(fs.readFileSync(File, 'utf-8'), ObfuscateTimes));
    console.log(`[OBFUSCATOR] Obfuscated file: ${File.replaceAll(`${process.cwd()}`, '')}`);
  });
});

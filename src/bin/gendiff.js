#!/usr/bin/env node
/* jshint esversion: 6 */
import program from 'commander';
import genDiff from '..';

const wrapperGenDiff = (firsFile, SecondFile) => {
  console.log(genDiff(firsFile, SecondFile));
};

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action(wrapperGenDiff);

program.parse(process.argv);

if (!program.args.length) program.help();

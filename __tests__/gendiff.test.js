import fs from 'fs';
import genDiff from '../src';

const pathToTestFiles = './__tests__/__fixtures__/';
const pathsToJSON = [`${pathToTestFiles}before.json`, `${pathToTestFiles}after.json`];
const pathsToYML = [`${pathToTestFiles}before.yml`, `${pathToTestFiles}after.yml`];
const pathsToINI = [`${pathToTestFiles}before.ini`, `${pathToTestFiles}after.ini`];

test.each([pathsToJSON, pathsToYML, pathsToINI])(
  'tests different format(JSON, yml, ini) in format = complex',
  (firsPath, secondPath) => {
    const res = fs.readFileSync('./__tests__/__fixtures__/res', 'utf8');
    expect(genDiff(firsPath, secondPath, 'complex')).toBe(res);
  },
);

test.each([pathsToJSON, pathsToYML, pathsToINI])(
  'tests different format(JSON, yml, ini) in format = plain',
  (firsPath, secondPath) => {
    const res = fs.readFileSync('./__tests__/__fixtures__/plainRes', 'utf8');
    expect(genDiff(firsPath, secondPath, 'plain')).toBe(res);
  },
);

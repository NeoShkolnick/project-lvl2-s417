import fs from 'fs';
import genDiff from '../src';

const pathToTestFiles = './__tests__/__fixtures__/';
const pathsToJSON = [`${pathToTestFiles}before.json`, `${pathToTestFiles}after.json`];
const pathsToYML = [`${pathToTestFiles}before.yml`, `${pathToTestFiles}after.yml`];
const pathsToINI = [`${pathToTestFiles}before.ini`, `${pathToTestFiles}after.ini`];

const res = fs.readFileSync('./__tests__/__fixtures__/res', 'utf8');
test.each([pathsToJSON, pathsToYML, pathsToINI])(
  'tests different format(JSON, yml, ini)',
  (firsPath, secondPath) => {
    expect(genDiff(firsPath, secondPath)).toBe(res);
  },
);

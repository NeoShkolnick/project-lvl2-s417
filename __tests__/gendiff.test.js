import fs from 'fs';
import genDiff from '../src';

test('json file', () => {
  const path1 = './__tests__/__fixtures__/before.json';
  const path2 = './__tests__/__fixtures__/after.json';
  const res = fs.readFileSync('./__tests__/__fixtures__/res', 'utf8');
  expect(genDiff(path1, path2)).toBe(res);
});

test('yml file', () => {
  const path1 = './__tests__/__fixtures__/before.yml';
  const path2 = './__tests__/__fixtures__/after.yml';
  const res = fs.readFileSync('./__tests__/__fixtures__/res', 'utf8');
  expect(genDiff(path1, path2)).toBe(res);
});

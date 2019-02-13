import fs from 'fs';
import genDiff from '../src';

test('relative path', () => {
  const path1 = './__tests__/__fixtures__/after1.json';
  const path2 = './__tests__/__fixtures__/before1.json';
  const res = fs.readFileSync('./__tests__/__fixtures__/res1', 'utf8');
  expect(genDiff(path1, path2)).toBe(res);
});

test('incorrect path', () => {
  const path1 = '/home/nick/hexlet/Project2/__tests__/__fixtures__/after1.json';
  const path2 = './qwe/__fixtures__/before1.json';
  expect(genDiff(path1, path2)).toBe('');
});

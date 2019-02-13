import genDiff from '../src/';
import fs from 'fs';

test('absolute path', () => {
  const path1 = '/home/nick/hexlet/Project2/__tests__/__fixtures__/after1.json';
  const path2 = '/home/nick/hexlet/Project2/__tests__/__fixtures__/before1.json';
  const res = fs.readFileSync('/home/nick/hexlet/Project2/__tests__/__fixtures__/res1', 'utf8');
  expect(genDiff(path1, path2)).toBe(res);
});

test('relative path', () => {
  const path1 = './__tests__/__fixtures__/after1.json';
  const path2 = './__tests__/__fixtures__/before1.json';
  const res = fs.readFileSync('/home/nick/hexlet/Project2/__tests__/__fixtures__/res1', 'utf8');
  expect(genDiff(path1, path2)).toBe(res);
});

test('incorrect path', () => {
  const path1 = '/home/nick/hexlet/Project2/__tests__/__fixtures__/after1.json';
  const path2 = './qwe/__fixtures__/before1.json';
  expect(genDiff(path1, path2)).toBe("");
});

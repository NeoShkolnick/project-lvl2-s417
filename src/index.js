import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getObjectFromContentFile from './parsers';

const getObjectFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const extensionFile = path.extname(filePath);
  return getObjectFromContentFile(content, path.extname(filePath));
};

export default (firsFilePath, secondFilePath) => {
  const content1 = fs.readFileSync(firsFilePath, 'utf8');
  const content2 = fs.readFileSync(secondFilePath, 'utf8');
  const objectFirst = getObjectFromFile(firsFilePath);
  const objectSecond = getObjectFromFile(secondFilePath);

  const keys1 = Object.keys(objectFirst);
  const keys2 = Object.keys(objectSecond);
  const results = _.union(keys1, keys2).reduce((acc, key) => {
    if (_.has(objectFirst, key) && _.has(objectSecond, key)) {
      if (objectFirst[key] === objectSecond[key]) {
        return [...acc, `    ${key}: ${objectFirst[key]}`];
      }
      return [...acc, `  + ${key}: ${objectSecond[key]}`, `  - ${key}: ${objectFirst[key]}`];
    }
    if (_.has(objectFirst, key)) {
      return [...acc, `  - ${key}: ${objectFirst[key]}`];
    }
    if (_.has(objectSecond, key)) {
      return [...acc, `  + ${key}: ${objectSecond[key]}`];
    }
    return acc;
  }, ['{']);
  return [...results, '}', ''].join('\n');
};

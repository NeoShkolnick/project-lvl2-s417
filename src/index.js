import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getObjectFromContent from './parsers';

const INDENT_SIZE = 4;


const getObjectFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const extensionFile = path.extname(filePath);
  return getObjectFromContent(content, extensionFile);
};

const buildAST = (objectFirst, objectSecond) => {
  const keysFirst = Object.keys(objectFirst);
  const keysSecond = Object.keys(objectSecond);
  const ast = _.union(keysFirst, keysSecond).reduce((acc, key) => {
    if (_.has(objectFirst, key) && _.has(objectSecond, key)) {
      if (_.isEqual(objectFirst[key], objectSecond[key])) {
        return { ...acc, [key]: objectFirst[key] };
      }
      if (objectFirst[key] instanceof Object && objectSecond[key] instanceof Object) {
        return { ...acc, [key]: buildAST(objectFirst[key], objectSecond[key]) };
      }
      return { ...acc, [key]: [objectFirst[key], objectSecond[key]] };
    }
    if (_.has(objectFirst, key)) {
      return { ...acc, [key]: [objectFirst[key], null] };
    }
    if (_.has(objectSecond, key)) {
      return { ...acc, [key]: [null, objectSecond[key]] };
    }
    return acc;
  }, {});
  return ast;
};

const stringify = (data, numSpaces) => {
  if (data instanceof Array) {
    return `${data}`;
  }
  if (data instanceof Object) {
    const tmp = Object.keys(data).reduce((acc, key) => {
      const indent = ' '.repeat(numSpaces + INDENT_SIZE);
      const value = stringify(data[key], numSpaces + INDENT_SIZE);
      return [...acc, `${indent}${key}: ${value}`];
    }, ['{']);
    return [...tmp, `${' '.repeat(numSpaces)}}`].join('\n');
  }
  return `${data}`;
};

const getFormattedStr = (key, value, numSpaces, sign = ' ') => {
  if (value === null) {
    return '';
  }
  const indent = ' '.repeat(numSpaces - 2);
  return `${indent}${sign} ${key}: ${stringify(value, numSpaces)}`;
};

export default (firsFilePath, secondFilePath) => {
  const objectFirst = getObjectFromFile(firsFilePath);
  const objectSecond = getObjectFromFile(secondFilePath);
  const ast = buildAST(objectFirst, objectSecond);

  const iter = (obj, numSpaces) => {
    const res = Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      if (value instanceof Array) {
        const [before, after] = value;
        const beforeFormattedValue = getFormattedStr(key, before, numSpaces, '-');
        const afterFormattedValue = getFormattedStr(key, after, numSpaces, '+');
        if (before !== null && after !== null) {
          return [...acc, beforeFormattedValue, afterFormattedValue];
        }
        if (before !== null) {
          return [...acc, beforeFormattedValue];
        }
        if (after !== null) {
          return [...acc, afterFormattedValue];
        }
      }
      const indent = ' '.repeat(numSpaces);
      if (value instanceof Object) {
        return [...acc, `${indent}${key}: {`,
          ...iter(value, numSpaces + INDENT_SIZE), `${indent}}`];
      }
      return [...acc, `${indent}${key}: ${value}`];
    }, []);
    return res;
  };
  return ['{', ...iter(ast, INDENT_SIZE), '}', ''].join('\n');
};

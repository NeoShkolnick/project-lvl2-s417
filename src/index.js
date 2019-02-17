import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import Node from './node';
import getObjectFromContent from './parsers';

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
        return [...acc, new Node('unmodified', key, objectFirst[key])];
      }
      if (objectFirst[key] instanceof Object && objectSecond[key] instanceof Object) {
        return [...acc, new Node('modified', key, null, buildAST(objectFirst[key], objectSecond[key]))];
      }
      return [...acc, new Node('modified', key, [objectFirst[key], objectSecond[key]])];
    }
    if (_.has(objectFirst, key)) {
      return [...acc, new Node('removed', key, objectFirst[key])];
    }
    if (_.has(objectSecond, key)) {
      return [...acc, new Node('added', key, objectSecond[key])];
    }
    return acc;
  }, []);
  return ast;
};

const getDiffFromAST = (ast, format) => {
  if (format === 'complex') {
    return ['{', ...ast.map((node => node.toComplexStr())), '}\n'].join('\n');
  }
  if (format === 'plain') {
    return `${ast.map((node => node.toPlainStr())).filter(el => el !== '').join('\n')}\n`;
  }
  return '';
};

export default (firsFilePath, secondFilePath, format) => {
  const objectFirst = getObjectFromFile(firsFilePath);
  const objectSecond = getObjectFromFile(secondFilePath);
  const ast = buildAST(objectFirst, objectSecond);
  return getDiffFromAST(ast, format);
};

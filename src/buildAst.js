import _ from 'lodash';
import { Node } from './node';

const buildAst = (objectFirst, objectSecond) => {
  const keysFirst = Object.keys(objectFirst);
  const keysSecond = Object.keys(objectSecond);
  const ast = _.union(keysFirst, keysSecond).reduce((acc, key) => {
    if (_.has(objectFirst, key) && _.has(objectSecond, key)) {
      if (_.isEqual(objectFirst[key], objectSecond[key])) {
        return [...acc, new Node('unmodified', key, objectFirst[key])];
      }
      if (objectFirst[key] instanceof Object && objectSecond[key] instanceof Object) {
        return [...acc, new Node('modified', key, null, buildAst(objectFirst[key], objectSecond[key]))];
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

export default buildAst;

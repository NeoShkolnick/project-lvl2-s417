import _ from 'lodash';
import getContent from './parsers';

export default (firsFile, secondFile) => {
  const content1 = getContent(firsFile);
  const content2 = getContent(secondFile);

  const keys1 = Object.keys(content1);
  const keys2 = Object.keys(content2);
  const results = _.union(keys1, keys2).reduce((acc, key) => {
    if (_.has(content1, key) && _.has(content2, key)) {
      if (content1[key] === content2[key]) {
        return [...acc, `    ${key}: ${content1[key]}`];
      }
      return [...acc, `  + ${key}: ${content2[key]}`, `  - ${key}: ${content1[key]}`];
    }
    if (_.has(content1, key)) {
      return [...acc, `  - ${key}: ${content1[key]}`];
    }
    if (_.has(content2, key)) {
      return [...acc, `  + ${key}: ${content2[key]}`];
    }
    return acc;
  }, ['{']);
  return [...results, '}', ''].join('\n');
};

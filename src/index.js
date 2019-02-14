import _ from 'lodash';
import parsers from './parsers';

export default (firsFile, secondFile) => {
  const content1 = parsers(firsFile);
  const content2 = parsers(secondFile);

  const acc1 = Object.keys(content1).reduce((acc, el) => {
    if (_.has(content2, el)) {
      if (content1[el] === content2[el]) {
        return [...acc, `    ${el}: ${content2[el]}`];
      }
      return [...acc, `  + ${el}: ${content2[el]}`, `  - ${el}: ${content1[el]}`];
    }
    return [...acc, `  - ${el}: ${content1[el]}`];
  }, ['{']);
  const acc2 = Object.keys(content2).reduce((acc, el) => (!_.has(content1, el) ? [...acc, `  + ${el}: ${content2[el]}`] : acc), acc1);
  return [...acc2, '}', ''].join('\n');
};

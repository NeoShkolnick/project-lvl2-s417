import fs from 'fs';
import _ from 'lodash';

export default (firsFile, SecondFile) => {
  const jsonFile1 = JSON.parse(fs.readFileSync(firsFile, 'utf8'));
  const jsonFile2 = JSON.parse(fs.readFileSync(SecondFile, 'utf8'));

  const acc1 = Object.keys(jsonFile1).reduce((acc, el) => {
    if (_.has(jsonFile2, el)) {
      if (jsonFile1[el] === jsonFile2[el]) {
        return [...acc, `    ${el}: ${jsonFile2[el]}`];
      }
      return [...acc, `  + ${el}: ${jsonFile2[el]}`, `  - ${el}: ${jsonFile1[el]}`];
    }
    return [...acc, `  - ${el}: ${jsonFile1[el]}`];
  }, ['{']);
  const acc2 = Object.keys(jsonFile2).reduce((acc, el) => (!_.has(jsonFile1, el) ? [...acc, `  + ${el}: ${jsonFile2[el]}`] : acc), acc1);
  return [...acc2, '}', ''].join('\n');
};

/* jshint esversion: 6 */
import fs from 'fs';
import _ from 'lodash';

let res = '';
const print = (sign, key, value) => {
  res += `  ${sign} ${key}: ${value}\n`;
};

export default (firsFile, SecondFile) => {
  try {
    const jsonFile1 = JSON.parse(fs.readFileSync(firsFile, 'utf8'));
    const jsonFile2 = JSON.parse(fs.readFileSync(SecondFile, 'utf8'));

    res = '{\n';
    Object.keys(jsonFile1).forEach((el) => {
      if (_.has(jsonFile2, el)) {
        if (jsonFile1[el] === jsonFile2[el]) {
          print(' ', el, jsonFile2[el]);
        } else {
          print('+', el, jsonFile2[el]);
          print('-', el, jsonFile1[el]);
        }
      } else {
        print('-', el, jsonFile1[el]);
      }
    });
    Object.keys(jsonFile2).forEach((el) => {
      if (!_.has(jsonFile1, el)) {
        print('+', el, jsonFile2[el]);
      }
    });
    res += '}';
    return res;
  } catch (err) {
    console.error(`${err.path} - incorrect dirrectory`);
    return '';
  }
};

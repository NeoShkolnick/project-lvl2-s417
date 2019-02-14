import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const getParseFunction = (ext) => {
  if (ext === '.yml') {
    return yaml.safeLoad;
  }
  return JSON.parse;
};

export default (filepath) => {
  const parse = getParseFunction(path.extname(filepath));
  return parse(fs.readFileSync(filepath, 'utf8'));
};

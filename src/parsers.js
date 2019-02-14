import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';

const getParseFunction = (ext) => {
  if (ext === '.yml') {
    return yaml.safeLoad;
  }
  if (ext === '.ini') {
    return ini.parse;
  }
  return JSON.parse;
};

export default (filepath) => {
  const parse = getParseFunction(path.extname(filepath));
  return parse(fs.readFileSync(filepath, 'utf8'));
};

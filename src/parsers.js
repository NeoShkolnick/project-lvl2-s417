import yaml from 'js-yaml';
import ini from 'ini';

const parseFunctions = {
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
  '.json': JSON.parse,
};

const getObjectFromContent = (content, extensionFile) => {
  const parse = parseFunctions[extensionFile];
  return parse(content);
};

export default getObjectFromContent;

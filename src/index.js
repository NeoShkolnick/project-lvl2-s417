import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getObjectFromContent from './parsers';
import buildAst from './buildAst';
import getAstRender from './renderers';

const getObjectFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const extensionFile = path.extname(filePath);
  return getObjectFromContent(content, extensionFile);
};

const genDiff = (firsFilePath, secondFilePath, format) => {
  const objectFirst = getObjectFromFile(firsFilePath);
  const objectSecond = getObjectFromFile(secondFilePath);

  const ast = buildAst(objectFirst, objectSecond);
  const render = getAstRender(format);
  return render(ast);
};

export default genDiff;

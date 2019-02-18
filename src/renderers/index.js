import complexRender from './complexRender';
import plainRender from './plainRender';
import jsonRender from './jsonRender';

const renderes = {
  complex: complexRender,
  plain: plainRender,
  json: jsonRender,
};

const getAstRender = (format) => {
  const toStr = renderes[format];
  if (!toStr) {
    return () => '';
  }
  return toStr;
};

export default getAstRender;

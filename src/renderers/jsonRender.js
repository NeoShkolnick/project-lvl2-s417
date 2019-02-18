import _ from 'lodash';

const INDENT_SIZE = 4;

const functionsFromTypes = {
  modified: (node, ancestry, prepare) =>
    node.children.map(child => prepare(child, `${ancestry}${node.key}.`))
      .filter(el => el !== ''),
  shifted: (node, ancestry) =>
    ({
      action: 'updated', path: `${ancestry}${node.key}`, oldValue: node.value[0], newValue: node.value[1],
    }),
  unmodified: () => '',
  removed: (node, ancestry) =>
    ({ action: 'removed', path: `${ancestry}${node.key}` }),
  added: (node, ancestry) =>
    ({ action: 'added', path: `${ancestry}${node.key}`, value: node.value }),
};

const jsonRender = (ast) => {
  const prepare = (node, ancestry = '') =>
    functionsFromTypes[node.type](node, ancestry, prepare);
  const objects = _.flattenDeep(ast.map((node => prepare(node))).filter(el => el !== ''));
  return `${JSON.stringify(objects, null, `${' '.repeat(INDENT_SIZE)}`)}\n`;
};

export default jsonRender;

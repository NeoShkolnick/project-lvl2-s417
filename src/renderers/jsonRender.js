import _ from 'lodash';

const INDENT_SIZE = 4;

const jsonRender = (ast) => {
  const prepare = (node, ancestry = '') => {
    const path = `${ancestry}${node.key}`;
    if (node.type === 'removed') {
      return { action: 'removed', path };
    }
    if (node.type === 'added') {
      return { action: 'added', path, value: node.value };
    }
    if (node.type === 'modified') {
      if (node.value instanceof Array) {
        return {
          action: 'updated', path, oldValue: node.value[0], newValue: node.value[1],
        };
      }
      return node.children.map(child => prepare(child, `${ancestry}${node.key}.`))
        .filter(el => el !== '');
    }
    return '';
  };
  const objects = _.flattenDeep(ast.map((node => prepare(node))).filter(el => el !== ''));
  return `${JSON.stringify(objects, null, `${' '.repeat(INDENT_SIZE)}`)}\n`;
};

export default jsonRender;

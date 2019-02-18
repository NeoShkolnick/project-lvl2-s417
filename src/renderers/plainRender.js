const functionsFromTypes = {
  modified: (node, ancestry, prepare) =>
    node.children.map(child => prepare(child, `${ancestry}${node.key}.`))
      .filter(el => el !== '').join('\n'),
  shifted: (node, ancestry) => {
    const value1 = node.value[0] instanceof Object ? '[complex value]' : node.value[0];
    const value2 = node.value[1] instanceof Object ? '[complex value]' : node.value[1];
    return `Property '${ancestry}${node.key}' was updated. From ${value1} to ${value2}`;
  },
  unmodified: () => '',
  removed: (node, ancestry) =>
    `Property '${ancestry}${node.key}' was removed`,
  added: (node, ancestry) => {
    const value = node.value instanceof Object ? '[complex value]' : node.value;
    return `Property '${ancestry}${node.key}'  was added with value: ${value}`;
  },
};

const plainRender = (ast) => {
  const prepare = (node, ancestry = '') =>
    functionsFromTypes[node.type](node, ancestry, prepare);
  return `${ast.map((node => prepare(node))).filter(el => el !== '').join('\n')}\n`;
};

export default plainRender;

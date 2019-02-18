const plainRender = (ast) => {

  const prepare = (node, ancestry = '') => {
    if (node.type === 'removed') {
      return `Property '${ancestry}${node.key}' was removed`;
    }
    if (node.type === 'added') {
      const value = node.value instanceof Object ? '[complex value]' : node.value;
      return `Property '${ancestry}${node.key}'  was added with value: ${value}`;
    }
    if (node.type === 'modified') {
      if (node.value instanceof Array) {
        const value1 = node.value[0] instanceof Object ? '[complex value]' : node.value[0];
        const value2 = node.value[1] instanceof Object ? '[complex value]' : node.value[1];
        return `Property '${ancestry}${node.key}' was updated. From ${value1} to ${value2}`;
      }
      return node.children.map(child => prepare(child, `${ancestry}${node.key}.`))
        .filter(el => el !== '').join('\n');
    }
    return '';
  };
  return `${ast.map((node => prepare(node))).filter(el => el !== '').join('\n')}\n`;
};

export default plainRender;

const INDENT_SIZE = 4;

const getTab = numSpaces => ' '.repeat(numSpaces);

const stringify = (data, numSpaces) => {
  if (data instanceof Object) {
    const tmp = Object.keys(data).reduce((acc, key) => {
      const value = stringify(data[key], numSpaces + INDENT_SIZE);
      return [...acc, `${getTab(numSpaces)}${key}: ${value}`];
    }, ['{']);
    return [...tmp, `${getTab(numSpaces - INDENT_SIZE)}}`].join('\n');
  }
  return `${data}`;
};

const functionsFromTypes = {
  modified: (node, numSpaces, prepare) => {
    const childrenStr = node.children.map((child => prepare(child, numSpaces + INDENT_SIZE)));
    return `${getTab(numSpaces)}${node.key}: ${['{', ...childrenStr, `${getTab(numSpaces)}}`].join('\n')}`;
  },
  shifted: (node, numSpaces) =>
    `${getTab(numSpaces - 2)}- ${node.key}: ${stringify(node.value[0], numSpaces + INDENT_SIZE)}\n`
    + `${getTab(numSpaces - 2)}+ ${node.key}: ${stringify(node.value[1], numSpaces + INDENT_SIZE)}`,
  unmodified: (node, numSpaces) =>
    `${getTab(numSpaces)}${node.key}: ${stringify(node.value, numSpaces + INDENT_SIZE)}`,
  removed: (node, numSpaces) =>
    `${getTab(numSpaces - 2)}- ${node.key}: ${stringify(node.value, numSpaces + INDENT_SIZE)}`,
  added: (node, numSpaces) =>
    `${getTab(numSpaces - 2)}+ ${node.key}: ${stringify(node.value, numSpaces + INDENT_SIZE)}`,
};

const complexRender = (ast) => {
  const prepare = (node, numSpaces = INDENT_SIZE) =>
    functionsFromTypes[node.type](node, numSpaces, prepare);
  return ['{', ...ast.map((node => prepare(node))), '}\n'].join('\n');
};

export default complexRender;

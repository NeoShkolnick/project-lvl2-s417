const signsFromType = {
  unmodified: ' ',
  modified: ' ',
  added: '+',
  removed: '-',
};

const INDENT_SIZE = 4;

const stringify = (data, numSpaces) => {
  if (data instanceof Object) {
    const tmp = Object.keys(data).reduce((acc, key) => {
      const value = stringify(data[key], numSpaces + INDENT_SIZE);
      return [...acc, `${' '.repeat(numSpaces)}${key}: ${value}`];
    }, ['{']);
    return [...tmp, `${' '.repeat(numSpaces - INDENT_SIZE)}}`].join('\n');
  }
  return `${data}`;
};


const complexRender = (ast) => {
  const prepare = (node, numSpaces = INDENT_SIZE) => {
    const indent = `${' '.repeat(numSpaces - 2)}`;
    if (node.type === 'modified') {
      if (node.value instanceof Array) {
        const value1 = stringify(node.value[0], numSpaces + INDENT_SIZE);
        const value2 = stringify(node.value[1], numSpaces + INDENT_SIZE);
        return `${indent}- ${node.key}: ${value1}\n${indent}+ ${node.key}: ${value2}`;
      }
      const childrenStr = node.children.map((child => prepare(child, numSpaces + INDENT_SIZE)));
      return `${indent}  ${node.key}: ${['{', ...childrenStr, `${indent}  }`].join('\n')}`;
    }
    const value = stringify(node.value, numSpaces + INDENT_SIZE);
    return `${indent}${signsFromType[node.type]} ${node.key}: ${value}`;
  };

  return ['{', ...ast.map((node => prepare(node))), '}\n'].join('\n');
};

export default complexRender;

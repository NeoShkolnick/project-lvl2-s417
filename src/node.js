export function Node(type, key, value = null, chuldren = []) {
  this.type = type;
  this.key = key;
  this.value = value;
  this.children = chuldren;
}

export const toPlainStr = (node, ancestry = '') => {
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
    return node.children.map(child => toPlainStr(child, `${ancestry}${node.key}.`))
      .filter(el => el !== '').join('\n');
  }
  return '';
};

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

export const toComplexStr = (node, numSpaces = INDENT_SIZE) => {
  const indent = `${' '.repeat(numSpaces - 2)}`;
  if (node.type === 'modified') {
    if (node.value instanceof Array) {
      const value1 = stringify(node.value[0], numSpaces + INDENT_SIZE);
      const value2 = stringify(node.value[1], numSpaces + INDENT_SIZE);
      return `${indent}- ${node.key}: ${value1}\n${indent}+ ${node.key}: ${value2}`;
    }
    const childrenStr = node.children.map((child => toComplexStr(child, numSpaces + INDENT_SIZE)));
    return `${indent}  ${node.key}: ${['{', ...childrenStr, `${indent}  }`].join('\n')}`;
  }
  const value = stringify(node.value, numSpaces + INDENT_SIZE);
  return `${indent}${signsFromType[node.type]} ${node.key}: ${value}`;
};

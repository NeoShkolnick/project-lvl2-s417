import _ from 'lodash';

export function Node(type, key, value = null, chuldren = []) {
  this.type = type;
  this.key = key;
  this.value = value;
  this.children = chuldren;
}

const INDENT_SIZE = 4;

export const toJsonStr = (ast) => {
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

export const toPlainStr = (ast) => {
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

const signsFromType = {
  unmodified: ' ',
  modified: ' ',
  added: '+',
  removed: '-',
};


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

export const toComplexStr = (ast) => {
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

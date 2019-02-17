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

const signsFromType = {
  unmodified: ' ',
  modified: ' ',
  added: '+',
  removed: '-',
};

export default class Node {
  constructor(type, key, value = null, chuldren = []) {
    this.type = type;
    this.key = key;
    this.value = value;
    this.children = chuldren;
  }

  toPlainStr(ancestry = '') {
    if (this.type === 'removed') {
      return `Property '${ancestry}${this.key}' was removed`;
    }
    if (this.type === 'added') {
      const value = this.value instanceof Object ? '[complex value]' : this.value;
      return `Property '${ancestry}${this.key}'  was added with value: ${value}`;
    }
    if (this.type === 'modified') {
      if (this.value instanceof Array) {
        const value1 = this.value[0] instanceof Object ? '[complex value]' : this.value[0];
        const value2 = this.value[1] instanceof Object ? '[complex value]' : this.value[1];
        return `Property '${ancestry}${this.key}' was updated. From ${value1} to ${value2}`;
      }
      return this.children.map(node => node.toPlainStr(`${ancestry}${this.key}.`))
        .filter(el => el !== '').join('\n');
    }
    return '';
  }

  toComplexStr(numSpaces = INDENT_SIZE) {
    const indent = `${' '.repeat(numSpaces - 2)}`;
    if (this.type === 'modified') {
      if (this.value instanceof Array) {
        const value1 = stringify(this.value[0], numSpaces + INDENT_SIZE);
        const value2 = stringify(this.value[1], numSpaces + INDENT_SIZE);
        return `${indent}- ${this.key}: ${value1}\n${indent}+ ${this.key}: ${value2}`;
      }
      const childrenStr = this.children.map((node => node.toComplexStr(numSpaces + INDENT_SIZE)));
      return `${indent}  ${this.key}: ${['{', ...childrenStr, `${indent}  }`].join('\n')}`;
    }
    const value = stringify(this.value, numSpaces + INDENT_SIZE);
    return `${indent}${signsFromType[this.type]} ${this.key}: ${value}`;
  }
}

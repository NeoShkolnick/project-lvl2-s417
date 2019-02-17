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

  toStr(numSpaces = INDENT_SIZE) {
    const value = stringify(this.value, numSpaces + INDENT_SIZE);
    const indent = `${' '.repeat(numSpaces - 2)}`;
    if (this.type === 'unmodified' && this.children.length !== 0) {
      const childrenStr = this.children.map((node => node.toStr(numSpaces + INDENT_SIZE)));
      return `${indent}  ${this.key}: ${['{', ...childrenStr, `${indent}  }`].join('\n')}`;
    }
    return `${indent}${signsFromType[this.type]} ${this.key}: ${value}`;
  }
}

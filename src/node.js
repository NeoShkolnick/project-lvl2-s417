function Node(type, key, value = null, chuldren = []) {
  this.type = type;
  this.key = key;
  this.value = value;
  this.children = chuldren;
}

export default Node;

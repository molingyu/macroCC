class Scopes {
  constructor(parent = null) {
    this.parent = parent;
    if (this.parent) this.parent.addChild(this);
    this.children = [];
    this.table = new Map();
  }

  addChild(child) {
    this.children.push(child);
  }

  add(key, value) {
    if (this.has(key)) return false;
    this.table.set(key, value);
  }

  set(key, value) {
    if (!this.allHas(key)) return false;
    this.table.set(key, value);
  }

  get(key) {
    let scopes = this;
    while (!scopes.table.has(key)) {
      scopes = scopes.parent;
    }
    return scopes.table.get(key);
  }

  has(key) {
    return this.table.has(key);
  }

  allHas(key) {
    let scopes = this;
    while (scopes) {
      if (scopes.has(key)) {
        return true;
      } else {
        scopes = scopes.parent;
      }
    }
  }
}

export default Scopes;
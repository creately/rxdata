function debug(...args) {
  // console.log(...args);
}

class LocalForage {
  constructor(name) {
    this.name = name;
    this.data = {};
  }

  iterate(iterator) {
    debug('iterate:', this.name, this.data);
    Object.keys(this.data)
      .forEach(key => iterator(this.data[key]));
    return Promise.resolve(null);
  }

  getItem(key) {
    debug('getItem:', this.name, key);
    return Promise.resolve(this.data[key]);
  }

  setItem(key, val) {
    debug('setItem:', this.name, key, val);
    this.data[key] = val;
    return Promise.resolve(null);
  }

  removeItem(key) {
    debug('removeItem:', this.name, key);
    delete this.data[key];
    return Promise.resolve(null);
  }

  clear() {
    debug('clear:', this.name);
    this.data = {};
    return Promise.resolve(null);
  }
}

LocalForage.collections = {};

LocalForage.createInstance = function (options) {
  debug('createInstance:', options);
  if (!LocalForage.collections[options.name]) {
    debug('createInstance: creating =>', options);
    LocalForage.collections[options.name] = new LocalForage(options.name);
  }
  return LocalForage.collections[options.name];
};

LocalForage.clear = function () {
  debug('clear: clearing', Object.keys(LocalForage.collections));
  LocalForage.collections = {};
}

module.exports = LocalForage;

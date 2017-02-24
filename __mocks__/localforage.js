class LocalForage {
  constructor(name) {
    this.name = name;
  }

  iterate(iterator) {
    return Promise.resolve(null);
  }
}

LocalForage.createInstance = function (name) {
  return new LocalForage(name);
};

module.exports = LocalForage;

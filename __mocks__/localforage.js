class LocalForage {
  constructor(name) {
    this.name = name;
  }
}

LocalForage.createInstance = function (name) {
  return new LocalForage(name);
};

module.exports = LocalForage;

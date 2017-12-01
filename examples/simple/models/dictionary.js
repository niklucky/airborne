class Dictionary {
  constructor(data) {
    console.log('data', data);
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.lang = data.lang;
  }
}

module.exports = Dictionary;

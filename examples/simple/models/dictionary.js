class Dictionary {
  constructor(data){
    this.id = data.id;
    this.word = data.word;
    this.translation = data.translation;
    this.lang = data.lang;
  }
}

module.exports = Dictionary;

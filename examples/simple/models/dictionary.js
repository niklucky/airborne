class Categories {
  constructor(data) {
    // console.log('data', data);
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
  }
}

module.exports = Categories;

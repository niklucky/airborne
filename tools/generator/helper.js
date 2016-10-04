module.exports = {
  toSingular: (string = this.controller) => {
    var last = string.length - 1;
    if(string[last] === 's'){
      return string.substring(0, last);
    }
    return string;
  },
  camelCaseToDashes: (string) => {
    let str = string.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
    let strArray = str.split(' ');

    let dashed = [];
    strArray.map(item => {
      if(item){
        dashed.push(item.toLowerCase());
      }
    });
    return dashed.join('-');
  },

  firstLower: (string) => {
    return string[0].toLowerCase() + string.substring(1, string.length);
  }
};

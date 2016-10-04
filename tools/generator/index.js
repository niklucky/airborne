const args = process.argv.slice(2);
const readline = require('readline');
const Generator = require('./generator');
const config = require('./config');
const helper = require('./helper');

var module,
    controller,
    service,
    mapper,
    model,
    fields;


var controller = args[0];
console.log("Warning! If controller exists generator will overwrite it!");
console.log('We will create controller: ', controller);
console.log();

var mappers = ['MySQL', 'Redis', 'MongoDb', 'HTTP'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Create service? (Y/n):', (answer) => {
  if(answer !== 'n'){
    service = helper.toSingular(args[0]);
  }
  rl.question('Create mapper? (Y/n):', (answer) => {
    if(answer !== 'n'){
      mapper = helper.toSingular(args[0]);
    }
    var i = 0;
    var extendMapper = mappers.map( m => {
      i++;
      return i + ". " + m;
    });
    extendMapper = "Which mapper to extend (default MySQL)? \n" + extendMapper.join("\n") + "\n: ";

    rl.question(extendMapper, (answer) => {
      if(answer !== 'n'){
        mapperExtend = mappers[(answer-1)] || mappers[0];
      }
      rl.question('List your fields comma separated or leave blank:', (answer) => {
        if(answer !== 'n'){
          model = answer;
        }
        new Generator(module, controller, service, mapper, mapperExtend, model)
            .setConfig(config)
            .start()
          .then( result => {
            console.log('Everything is good. Bye!');
            rl.close();
          }).catch(e => {
            console.log('Generator error:', e);
            rl.close();
          });
      });
    });
  });

});

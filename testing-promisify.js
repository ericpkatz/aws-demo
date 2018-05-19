const chalk = require('chalk');
const calculator = {
  add: (a, b, cb)=> {
    if(isNaN(a) || isNaN(b)){
      return cb('please give us numbers');
    }
    const sum = a + b;
    cb(null, sum);
  }
};
//console.log(calculator);
require('bluebird').promisifyAll(calculator);
//console.log(calculator);

/*
calculator.add(1, 'x', (ex, result)=> {
  if(ex){
    return console.log(chalk.red(ex));
  }
  console.log(chalk.green(result));
});
*/

calculator.addAsync(1, 'x')
  .then( sum => console.log(chalk.green(sum)))
  .catch( ex => console.log(chalk.red(ex)));



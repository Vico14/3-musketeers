/*eslint-disable no-process-exit*/
const got = require('got');
const money = require('money');
const chalk = require('chalk');
const ora = require('ora');
const currencies = require('../lib/currencies.json');

const API = 'https://api.fixer.io/latest';

//convert function 
const convert = configuration => {
  const {amount, to, from, response, loading} = configuration;

  money.base = response.body.base;
  money.rates = response.body.rates;

  to.forEach(item => {
    if (currencies[item]) {
      loading.succeed(
        `${chalk.green(
          money.convert(amount, {from, 'to': item}).toFixed(2) //green result (amount converterd)
        )} ${`(${item})`} ${currencies[item]}` // of the corrency
      );
    } else { //display error message if the currency is not found
      loading.warn(`${chalk.yellow(` The ${item} currency not found `)}`);
    }
  });

  console.log();
  console.log(
    chalk.underline.gray( // gray message, the type of currency we wanted to convert and the amount
      ` Conversion of ${chalk.bold(from)} ${chalk.bold(amount)}`
    )
  );
  process.exit(1);
};
// set attributes to our commands
const cash = async command => {
  const amount = command.amount; //amount
  const from = command.from.toUpperCase(); //set the type of currency we want to convert,  to Upper Case
  const to = command.to // Type of final currency
    .filter(item => item !== from) //if it exists
    .map(item => item.toUpperCase()); //to upper case

  console.log();//message while loading
  const loading = ora({
    'text': 'Converting currency...',
    'color': 'green',
    'spinner': {
      'interval': 200,
      'frames': to
    }
  });

  loading.start();

  try {
    const response = await got(API, {'json': true});

    convert({amount, to, from, response, loading});
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      loading.fail(chalk.red('   Please check your internet connection.\n'));
    } else {
      loading.fail(chalk.red('   Internal server error... \n'));
    }

    process.exit(1);
  }
};

module.exports = cash;

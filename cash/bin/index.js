#!/usr/bin/env node

const Conf = require('conf');
const helpers = require('./helpers.js');
const cash = require('./cash.js');

const config = new Conf();

const argv = process.argv.slice(2);
// show the helpers from helpers.js 
helpers(argv);
//when we use node index.js 
const command = {
  'amount': argv[0] || 1, //the first parameter after is the amount you want to convert
  'from': argv[1] || config.get('defaultFrom', 'USD'), //if no  second argument about the currency to convert set default to usd
  'to':
    argv.length > 2 //if 3rd parameter convert from the second ( by exemple usd) to the 3rd parameter
      ? process.argv.slice(4)
      : config.get('defaultTo', ['USD', 'EUR', 'GBP']) 
};

cash(command);

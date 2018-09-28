# **B**igchainDB **L**oad **T**ester

[![Build Status](https://travis-ci.org/artus/bltjs.svg?branch=master)](https://travis-ci.org/artus/bltjs)

## What is blt.js?

`blt.js` is an npm package that can be used to load-test a BigchainDB node/network. It can be used for running daily jobs that will help you asses the efficiency of your BigchainDB network or to see if changes and/or updates have impacted its performance.

## Installation

```shell
npm install bltjs
```

## Usage

1. Initialization

```javascript
const bltjs = require("../dist/Blt.js");

// Initialize a new blt.js instance that will connect to the BigchainDB node on https://your.bigchaindb.host:8080
let newBlt = new bltjs.Blt("https", "your.bigchaindb.host", "8080");
```

2. Testing CREATE-transactions

You can test the speed of a supplied amount of [CREATE-transactions](http://docs.bigchaindb.com/en/latest/transaction-concepts.html#create-transactions) running in parallel. You supply a string that contains an identifier for the test, and the amount of CREATE-transactions to perform.

You should provide a clear and logical test identifier, as the CREATE-transactions will be issued on your live blockchain network. By using a logical test identifier you can filter the test-transactions in the future.

```javascript
newBlt.testCreateTransactions("some_test_identifier", 500).then(result => {

  // The result will be an object containing information about the test.
  console.log(result);

  }).catch( error => {
  console.log(error);
})
```

3. Testing TRANSFER-transactions

Testing a chain of [TRANSFER-transactions](http://docs.bigchaindb.com/en/latest/transaction-concepts.html#transfer-transactions) will always happen in series, as they build upon eachother. You issue them in relatively the same way as the chain of CREATE-transactions: you supply a test identifier and the amount of TRANSFER-transactions that should be chained.

```javascript
newBlt.testTransferTransactions("some_test_identifier", 500).then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});
```
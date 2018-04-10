const mocha = require("mocha");
const assert = require("assert");

const bltjs = require("../dist/Blt.js");

const HTTP = "http";
const HTTPS = "https";

const VALID_HOST = "test.bigchaindb.com";
const VALID_PORT = "9984";
const VALID_API_PATH = "/api/v1/";

function initializeNewBlt() {
    return new bltjs.Blt(HTTPS, VALID_HOST);
}

function initializeLocalBlt() {
    return new bltjs.Blt(HTTP, "localhost", "9984");
}

describe("Btl.js", function () {
    this.timeout(10000);

    describe("constructor", function () {

        it("should throw an error when not providing required parameters", function (done) {
            try {
                let newBlt = new bltjs.Blt();
                done(new Error("Faillure to provide required parameters does not result in error."));
            }
            catch (error) {
                done();
            }
        });

        it("should succeed when providing valid parameters.", function () {
            let newBlt = new bltjs.Blt(HTTPS, VALID_HOST);
            assert.notEqual(newBlt, undefined);
        });

        it("should set instance variables correctly.", function () {
            let newBlt = new bltjs.Blt(HTTP, VALID_HOST, VALID_PORT, VALID_API_PATH);
            let resultingUrl = HTTP + "://" + VALID_HOST + ":" + VALID_PORT;

            assert.equal(newBlt.root_url, resultingUrl);
            assert.equal(newBlt.api_url, resultingUrl + VALID_API_PATH);
        });

    });

    describe("getNodeInformation()", function () {

        it("should load NodeInfo correctly.", async function () {

            let newBlt = initializeLocalBlt();

            let nodeInfo = await newBlt.getNodeInformation();
            assert.notEqual(undefined, nodeInfo.docs);
            assert.notEqual(undefined, nodeInfo.keyring);
            // This is due to bdb 2.0
            //assert.equal("null", typeof nodeInfo.public_key);
            assert.notEqual(undefined, nodeInfo.software);
            assert.notEqual(undefined, nodeInfo.version);
        });

        it("should load ApiInfo correctly.", async function () {

            let newBlt = initializeLocalBlt();

            let nodeInfo = await newBlt.getNodeInformation();
            let apiInfo = nodeInfo.apiInfo;

            assert.notEqual(undefined, apiInfo.version);
            assert.notEqual(undefined, apiInfo.assets);
            //assert.notEqual(undefined, apiInfo.docs);
            //assert.notEqual(undefined, apiInfo.statuses);
            assert.notEqual(undefined, apiInfo.streams);
            assert.notEqual(undefined, apiInfo.transactions);
        });

    });

    describe("testCreateTransactions()", function() {

        it("Should return a Promise when all transactions are appended.", function(done) {
            let newBlt = initializeLocalBlt();

            newBlt.testCreateTransactions("test", 5).then(result => {
                done();
            }).catch( error => {
                done(error);
            })
            
        })

        it("should complete the test without issues.", async function() {
            let newBlt = initializeLocalBlt();

            let testResult = await newBlt.testCreateTransactions("test", 5);

            assert.equal(5, testResult.transactions.length);
            assert.equal(5, testResult.responses.length);
        });

    });

    describe("testTransferTransactions()", function() {

        it("Should return a Promise when all transactions are appended.", function(done) {
            let newBlt = initializeLocalBlt();

            newBlt.testTransferTransactions("testTransfer", 5).then(result => {
                done();
            }).catch(error => {
                done(error);
            })
        })

    })

});
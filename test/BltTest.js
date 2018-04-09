const mocha = require("mocha");
const assert = require("assert");

const bltjs = require("../dist/Blt.js");

const HTTP = "http";
const HTTPS = "https";

const VALID_HOST = "test.bigchaindb.com";
const VALID_PORT = "9884";
const VALID_API_PATH = "/api/v1/";

function initializeNewBlt() {
    return new bltjs.Blt(HTTPS, VALID_HOST);
}

describe("Btl.js", function () {

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

        it("should set instance variables correclty.", function () {
            let newBlt = new bltjs.Blt(HTTP, VALID_HOST, VALID_PORT, VALID_API_PATH);
            let resultingUrl = HTTP + "://" + VALID_HOST + ":" + VALID_PORT;

            assert.equal(newBlt.root_url, resultingUrl);
            assert.equal(newBlt.api_url, resultingUrl + VALID_API_PATH);
        });

    });

    describe("getNodeInformation()", function () {

        it("should load NodeInfo correctly.", async function () {

            let newBlt = initializeNewBlt();

            let nodeInfo = await newBlt.getNodeInformation();
            assert.notEqual(undefined, nodeInfo.docs);
            assert.notEqual(undefined, nodeInfo.keyring);
            assert.notEqual(undefined, nodeInfo.public_key);
            assert.notEqual(undefined, nodeInfo.software);
            assert.notEqual(undefined, nodeInfo.version);
        });

        it("should load ApiInfo correclty.", async function () {

            let newBlt = initializeNewBlt();

            let nodeInfo = await newBlt.getNodeInformation();
            let apiInfo = nodeInfo.apiInfo;

            assert.notEqual(undefined, apiInfo.version);
            assert.notEqual(undefined, apiInfo.assets);
            assert.notEqual(undefined, apiInfo.docs);
            assert.notEqual(undefined, apiInfo.statuses);
            assert.notEqual(undefined, apiInfo.streams);
            assert.notEqual(undefined, apiInfo.transactions);
        });

    });

});
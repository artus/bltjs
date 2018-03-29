const mocha = require("mocha");
const assert = require("assert");

const bltjs = require("../dist/Blt.js");

const HTTP = "http";
const HTTPS = "https";

const VALID_HOST = "test.bigchaindb.com";
const VALID_PORT = "9884";
const VALID_API_PATH = "/api/v1/";

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

        it("should set instance variables correclty.", function() {
            let newBlt = new bltjs.Blt(HTTP, VALID_HOST, VALID_PORT, VALID_API_PATH);
            let resultingUrl = HTTP + "://" + VALID_HOST + ":" + VALID_PORT;

            assert.equal(newBlt.root_url, resultingUrl);
            assert.equal(newBlt.api_url, resultingUrl + VALID_API_PATH);
        });

    });

});